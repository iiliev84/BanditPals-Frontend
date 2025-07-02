import { useRef, useEffect } from "react";

function isColliding(a, b) {
	if (
		a.x + a.size >= b.x &&
		a.x <= b.x + b.size &&
		a.y + a.size >= b.y &&
		a.y <= b.y + b.size
	)
		return true;
}

const GameEngine = ({ width = 800, height = 600 }) => {
	const canvasRef = useRef(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

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
			lastTime: performance.now(),
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
			raccoon: [
				{
					x: width / 2,
					y: height / 2,
					size: 60,
					speed: 200,
					isAlive: true,
				},
			],

			update(dt) {
				this.raccoon.forEach((raccoon) => {
					if (raccoon.isAlive) {
						if (keys["KeyW"]) raccoon.y -= raccoon.speed * dt;
						if (keys["KeyS"]) raccoon.y += raccoon.speed * dt;
						if (keys["KeyA"]) raccoon.x -= raccoon.speed * dt;
						if (keys["KeyD"]) raccoon.x += raccoon.speed * dt;
						const radius = raccoon.size / 2;
						raccoon.x = Math.min(width - radius, Math.max(radius, raccoon.x));
						raccoon.y = Math.min(height - radius, Math.max(radius, raccoon.y));
						this.trash = this.trash.filter((trash) => {
							return !isColliding(raccoon, trash);
						});
					}
				});
				this.trash.forEach((trash) => {
					trash.x += trash.velocityx * dt;
					trash.y += trash.velocityy * dt;
					const radius = trash.size / 2;
					if (trash.x < radius || trash.x > width - radius)
						trash.velocityx *= -1;
					if (trash.y < radius || trash.y > height - radius)
						trash.velocityy *= -1;
				});
			},
			render(ctx) {
				ctx.clearRect(0, 0, width, height);
				this.raccoon.forEach((raccoon) => {
					const size = raccoon.size;
					ctx.fillStyle = "grey";
					ctx.fillRect(raccoon.x - size / 2, raccoon.y - size / 2, size, size);
				});
				this.trash.forEach((trash) => {
					const size = trash.size;
					ctx.fillStyle = "red";
					ctx.fillRect(trash.x - size / 2, trash.y - size / 2, size, size);
				});
			},
		};

		let frameId;

		function loop(now) {
			const dt = (now - engine.lastTime) / 1000;
			engine.lastTime = now;
			engine.update(dt);
			engine.render(ctx);
			frameId = requestAnimationFrame(loop);
		}

		frameId = requestAnimationFrame(loop);

		//cleanup function:
		return () => {
			cancelAnimationFrame(frameId);
			window.removeEventListener("keydown", keydown);
			window.removeEventListener("keyup", keyup);
		};
	}, [width, height]);
	return (
		<>
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
