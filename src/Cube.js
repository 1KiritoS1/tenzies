import React, { useEffect, useState } from 'react';
import { dots } from './dots';
import { nanoid } from 'nanoid';

function Cube({ value, isHeld, holdCube }) {
	const styles = {
		backgroundColor: isHeld ? '#59e391' : '#fff'
	}
	
	function Column({span, column}) {
		const newArr = [];
		const spanElements = [];
		const arrOfStr = span.split(',');
		const arrOfNums = arrOfStr.map(str => Number(str)); 

		for (let i = 0; i < arrOfNums.length; i++) {
			const arrOfSpan = dots.slice(0, arrOfNums[i]);

			spanElements.push(arrOfSpan.map(span => 
				<span key={`dot-${span}`} className="dot"></span> // nanoid()
			));
		}
		
		if (column === '0') {
			newArr.push(spanElements);
		} else {
			for (let i = 0; i < column; i++) {
				newArr.push(
					<div key={nanoid()} className="column">
						{ spanElements[i] }
					</div>
				);
			}
		}
		return (<>{ newArr }</>);
	}

	function generateDots() {
		const newArr = [];

		for (let i = 0; i < value; i++) {
			if (value === 4 || value === 6) {
				value === 4 ? 
					newArr.push(
						<React.Fragment key={ nanoid() }>
							<Column column="2" span="2, 2"/>
						</React.Fragment>
					)
					: 
					newArr.push(
						<React.Fragment key={ nanoid() }>
							<Column column="2" span="3, 3"/>
						</React.Fragment>
					);
				return newArr; 
			} else if (value <= 3) {
				newArr.push(
					<React.Fragment key={ nanoid() }>
						<Column column="0" span={value.toString()}/>
					</React.Fragment>
				)
				return newArr;
			} else {
				newArr.push(
					<React.Fragment key={ nanoid() }>
						<Column column="3" span="2, 1, 2"/>
					</React.Fragment>
				)
				return newArr;
			}
		}
		return newArr;
	}

	const [cubes, setCubes] = useState(0);
	// In order to function returns once, 'cause
	// timer ( setInterval ) in App.js rerender it again and again.
	useEffect(() => {
		setCubes(generateDots()); 
	}, []);

	return (
		<div
			className={`cube face-${value}`}
			style={styles}
			onClick={holdCube}
		>
			{ cubes }
		</div>
	)
}
export default Cube;