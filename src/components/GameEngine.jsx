import { useRef, useEffect, useState } from "react";

function isColliding(a, b) {
	if (
		a.x + a.size >= b.x &&
		a.x <= b.x + b.size &&
		a.y + a.size >= b.y &&
		a.y <= b.y + b.size
	)
		return true;
}

const GameEngine = ({ width = 800, height = 600, setScore }) => {
	//useRef keeps the page from re-rendering and keeps the canvas updating
	const canvasRef = useRef(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		//ctx -> canvas is on a 2d plane
		const ctx = canvas.getContext("2d");

		//keydown and keyup register the press of the keys for movement
		const keys = {};
		const keydown = (event) => {
			keys[event.code] = true;
		};

		const keyup = (event) => {
			keys[event.code] = false;
		};

		window.addEventListener("keydown", keydown);
		window.addEventListener("keyup", keyup);

		const engine = {
			//lastTime -> most recent time that the time was checked
			lastTime: performance.now(),

			score: 0,

			//hit boxes / size of each of the components
			//x and y -> spawn points; velocity -> how fast they're moving; size -> pixels
			trash: [
				{
					x: 100,
					y: 100,
					velocityx: 50,
					velocityy: 20,
					size: 40,
				},
				{
					x: 75,
					y: 75,
					velocityx: -40,
					velocityy: 10,
					size: 30,
				},
				{
					x: 500,
					y: 500,
					velocityx: -30,
					velocityy: 20,
					size: 30,
				},
				{
					x: 550,
					y: 550,
					velocityx: 20,
					velocityy: -20,
					size: 30,
				},
			],
			//width and height /2 to create the center of mass
			raccoon: [
				{
					x: width / 2,
					y: height / 2,
					size: 60,
					speed: 200,
					isAlive: true,
				},
			],

			//dt = delta time -> change in time
			update(dt) {
				this.raccoon.forEach((raccoon) => {
					//if the raccoon is alive and the key is pressed, it will move at a certain speed
					//determines if the raccoon hits a wall and stops the movement
					if (raccoon.isAlive) {
						if (keys["KeyW"]) raccoon.y -= raccoon.speed * dt;
						if (keys["KeyS"]) raccoon.y += raccoon.speed * dt;
						if (keys["KeyA"]) raccoon.x -= raccoon.speed * dt;
						if (keys["KeyD"]) raccoon.x += raccoon.speed * dt;
						const radius = raccoon.size / 2;
						raccoon.x = Math.min(width - radius, Math.max(radius, raccoon.x));
						raccoon.y = Math.min(height - radius, Math.max(radius, raccoon.y));

						const beforeCount = this.trash.length;
						this.trash = this.trash.filter(
							(trash) => !isColliding(raccoon, trash)
						);
						const afterCount = this.trash.length;
						this.score += beforeCount - afterCount;
                        setScore(this.score)
					}
				});
				this.trash.forEach((trash) => {
					//determines if the trash hits a wall in the canvas
					//if it hits the wall, it will bounce off and move in the opposite direction (-1)
					trash.x += trash.velocityx * dt;
					trash.y += trash.velocityy * dt;
					const radius = trash.size / 2;
					if (trash.x < radius || trash.x > width - radius)
						trash.velocityx *= -1;
					if (trash.y < radius || trash.y > height - radius)
						trash.velocityy *= -1;
				});
			},

			//renders the canvas
			render(ctx) {
				ctx.clearRect(0, 0, width, height);
				//rendering the raccoon on the canvas
				this.raccoon.forEach((raccoon) => {
					const size = raccoon.size;
					ctx.fillStyle = "grey";
					ctx.fillRect(raccoon.x - size / 2, raccoon.y - size / 2, size, size);
					//moves the reference point from the top left corner to the center of mass
				});
				//rendering the trash on the canvas
				this.trash.forEach((trash) => {
					const size = trash.size;
					ctx.fillStyle = "red";
					ctx.fillRect(trash.x - size / 2, trash.y - size / 2, size, size);
				});
                
				ctx.fillStyle = "black";
				ctx.font = "24px Arial";
				ctx.fillText(`Score: ${this.score}`, 10, 30);
			},
		};

		let frameId;

		//loop constantly refreshes the frame to keep the game running and updating
		function loop(now) {
			const dt = (now - engine.lastTime) / 1000;
			engine.lastTime = now;
			engine.update(dt);
			engine.render(ctx);
			frameId = requestAnimationFrame(loop);
		}

		frameId = requestAnimationFrame(loop);

		//cleanup function:
		//removed the eventlistener to stop tracking key presses to help with memory usage
		return () => {
			cancelAnimationFrame(frameId);
			window.removeEventListener("keydown", keydown);
			window.removeEventListener("keyup", keyup);
		};
	}, [width, height]);

	function Timer() {
	const [isActive, setIsActive] = useState(false);
  	const [seconds, setSeconds] = useState(10);

   	useEffect(() => {
		const handleKeyDown = (event) => {
      	if ((event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') && !isActive) {
        setIsActive(true);
      	}
    	};

    	window.addEventListener('keydown', handleKeyDown);

    	return () => {
      	window.removeEventListener('keydown', handleKeyDown);
    	};
  }	, [isActive]); 

  	useEffect(() => {
		if (!seconds) {

			//navigate('/leaderboard');
			return;
		} // stop the counter when 0
    	let timer
    	if(isActive){
			timer = setInterval(() => {
        	setSeconds((seconds) => seconds - 1);
      	}, 1000); // Decrement seconds every 1 second
    	}
    return () => {
      clearInterval(timer); // Clear the interval on re-render
    };
  });

  	return <div><p>Time remaining: {seconds} seconds</p></div>;
}
	return (
		<>
			<div> {Timer()}</div>;
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				style={{ border: "1px solid black" }}
			></canvas>
		</>
	);
};

export default GameEngine;
