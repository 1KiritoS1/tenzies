import React, { useEffect, useState } from 'react';
import Cube from './Cube';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import 'animate.css';

function App() {
	const [count, setCount] = useState(0);
	const [color, setColor] = useState('white');
	const [tenzies, setTenzies] = useState(false);
	const [numbers, setNumbers] = useState(allNumbers);
	const cubes = numbers.map(number => (
		<Cube 
			value={number.value} 
			key={number.id}
			isHeld={number.isHeld}
			holdCube={() => { holdCube(number.id) }}
		/> 
	));
	
	/* --- Counter --- */
	const [countUp, setCountUp] = useState('?');
	const [counter, setCounter] = useState(false);
	const [countText, setCountText] = useState('count-text');
	const [countTextUp, setCountTextUp] = useState('count-text-up');


	/* --- Timer --- */
	const [timer, setTimer] = useState(0);
	const [bestTime, setBestTime] = useState(
		JSON.parse(localStorage.getItem('bestTime')) || 0
	);
	const [startGame, setStartGame] = useState(false);

	useEffect(() => {
		const firstValue = numbers[0].value;
		const allCubesHeld = numbers.every(cube => cube.isHeld);
		const allCubesNotHeld = numbers.every(cube => !cube.isHeld);
		const allSameValue = numbers.every(cube => cube.value === firstValue); 

		if ((count === 0 && !allCubesNotHeld) || count === 1) { 
			setStartGame(true);
		} 
		if (allCubesHeld && allSameValue) {
			setTenzies(true);
			setStartGame(false);
			setRecord();
		} 
	}, [numbers, count]);
	
	useEffect(() => {
		let interval = null;

		if (startGame) {
			interval = setInterval(() => {
				setTimer(prevTime => prevTime + 10);
			}, 10);
		} else {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [startGame]);
	
	function setRecord() {
		const currentTime = Math.floor(timer / 10);
		
		if (!bestTime || currentTime < bestTime) {  // bestTime === 0
			setBestTime(currentTime); // seconds.milliseconds 
		}
	}

	useEffect(() => {
		localStorage.setItem('bestTime', JSON.stringify(bestTime));
	}, [bestTime]);

	function changeColor() {
		if (count === 19) { // At 20 changes color
			setColor('#f4ecdd');
		} else if (count === 39) { // At 40 changes color
			setColor('#fdcb50');
		} else if (count === 59) { // At 60 changes color
			setColor('#ff5c5c');
		} 
	}
	
	function generateNewCube() {
		return {
			value: Math.ceil(Math.random() * 6), 
			isHeld: false,
			id: nanoid()
		}
	}

	function allNumbers() {
		const newCube = [];

		for (let i = 0; i < 10; i++) {
			newCube.push(generateNewCube());
		}
		return newCube;
	}

	function holdCube(cubeId) {
		setNumbers(oldCubes => oldCubes.map(cube => {
			return cube.id === cubeId ? 
				{...cube, isHeld: !cube.isHeld} : cube
		}));
	}

	function rollCounter() {
		const temp = countText;

		setCounter(false);
		setCountText(countTextUp);
		setCountTextUp(temp);
	}

	function rollCubes() {
		setCounter(true);
		setTimeout(() => rollCounter(), 400); // Counter roll animation

		if (!tenzies) {
			setNumbers(oldCubes => oldCubes.map(cube => {
				return cube.isHeld ?
					cube : generateNewCube();
			}));
			setCount(prevCount => prevCount + 1);
			setCountUp(count + 1);
			changeColor();
		} else {
			resetGame();
		}
	}

	function resetGame() {
		setTenzies(false);
		setNumbers(allNumbers);
		setCount(0);
		setTimer(0);
	}
	
	return (
		<div className="container">
			<main>
				{ tenzies && <Confetti style={{margin: '0 auto'}} /> }

				<h1 className="title">
					Tenzies
				</h1>
				{ !tenzies && <p className="text">
					Roll until all dice are the same. <br />
					Click each die to freeze it at its current value between rolls.
				</p> }
				{ tenzies && 
				<div className="win-block">
					<p className="text--win text--rainbow">
						You won!
					</p> 
				</div> } 
				
				<div className="stats text">
					<p id="timer" className="timer">
						Timer: {("0" + Math.floor((timer / 1000) % 60)).slice(-2)}:
            				   {("0" + ((timer / 10) % 1000)).slice(-2)}
					</p>
					<p className="timer">
						Best time: { (bestTime / 100) + 's' }
					</p>
				</div>
				<div className="cubes">
					{ cubes }
				</div>

				<button onClick={rollCubes}>
					{ tenzies ? 'New Game' : 'Roll' }
				</button>
				<div className={'count' + (counter ? ' active ' : '')}> 
					<div className={countText}>
						{ countUp }
					</div>
					<div 
						className={countTextUp}
						style={{color: `${color}`}}
					>
						{ count }
					</div>
				</div>
			</main>
		</div>
	);
} 
export default App;