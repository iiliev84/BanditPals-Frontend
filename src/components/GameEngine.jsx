import { useRef, useEffect } from "react";
import raccoonImageUrl from "../assets/raccoon.png";
import rockImageUrl from "../assets/rock.png";
import trashImageUrl from "../assets/trash.png";
import { useNavigate } from "react-router-dom";
import useSound from 'use-sound';
import ImpactSound from '../assets/impact.mp3';


function isColliding(a, b) {
	if (
		a.x + a.size >= b.x &&
		a.x <= b.x + b.size &&
		a.y + a.size >= b.y &&
		a.y <= b.y + b.size
	)
		return true;
};

let startTime;
let totalSeconds;

const GameEngine = ({
	width = 800,
	height = 600,
	setScore,
	score,
	setTime,
	token,
	userId
}) => {
	const navigate = useNavigate();
	//useRef keeps the page from re-rendering and keeps the canvas updating
	const canvasRef = useRef(null);
	
	const [playImpact] = useSound(ImpactSound);

	useEffect(()=>{
		playImpact();			
		},[score]);

	async function unlockAchievement(achievement_id){
	console.log(`got here :)`)
	console.log(`token`, token)
	try{
		const response = await fetch(`http://localhost:3000/achievements/`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
		body: JSON.stringify({
			achievement_id: achievement_id
		}),
	});
		const result = await response.json();
		console.log(`post result`, result);
	}catch(error){
		console.error(`Achievement unlock failed`)
	};
};

//rewrite achievements to focus on time not trash
function checkMilestoneAchievements(totalSeconds){
	console.log(`line 35`, totalSeconds);
	if (totalSeconds >= 10) unlockAchievement(1);
	if (totalSeconds >= 15) unlockAchievement(2);
	if (totalSeconds >= 30) unlockAchievement(3);
};
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
		//racoon icon
		const raccoonImage = new Image();
		raccoonImage.src = raccoonImageUrl;
		let raccoonImageLoaded = false;
		//tracks when icon loads
		raccoonImage.onload = () => {
			raccoonImageLoaded = true;
		};
		//rock icon
		const rockImage = new Image();
		rockImage.src = rockImageUrl;
		let rockImageLoaded = false;
		rockImage.onload = () => {
			rockImageLoaded = true;
		};
		//trash icon
		const trashImage = new Image();
		trashImage.src = trashImageUrl;
		let trashImageLoaded = false;
		trashImage.onload = () => {
			trashImageLoaded = true;
		};

		const engine = {
			//lastTime -> most recent time that the time was checked
			lastTime: performance.now(),

			score: 0,

			hasRaccoonMoved: false,

			//hit boxes / size of each of the components
			//x and y -> spawn points; velocity -> how fast they're moving; size -> pixels
			trash: [
				{
					x: 100,
					y: 100,
					velocityx: -50,
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
				{
					x: 70,
					y: 80,
					velocityx: -10,
					velocityy: 30,
					size: 40,
				},
				{
					x: 65,
					y: 250,
					velocityx: 50,
					velocityy: 20,
					size: 30,
				},
				{
					x: 500,
					y: 400,
					velocityx: 30,
					velocityy: -30,
					size: 20,
				},
				{
					x: 550,
					y: 475,
					velocityx: 40,
					velocityy: -20,
					size: 20,
				},
				{
					x: 500,
					y: 400,
					velocityx: 60,
					velocityy: -60,
					size: 20,
				},
				{
					x: 525,
					y: 375,
					velocityx: 30,
					velocityy: -20,
					size: 20,
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
			//calling static obstacles rocks for now
			rocks: [
				{ x: 200, y: 150, size: 50 },
				{ x: 475, y: 325, size: 60 },
				{ x: 600, y: 450, size: 40 },
				{ x: 190, y: 500, size: 60 },
				{ x: 600, y: 150, size: 40 },
				{ x: 100, y: 300, size: 60 },
				{ x: 400, y: 100, size: 40 },
			],

			//dt = delta time -> change in time
			update(dt) {
				if (
					!this.hasRaccoonMoved &&
					(keys["KeyW"] || keys["KeyA"] || keys["KeyS"] || keys["KeyD"])
				) {
					this.hasRaccoonMoved = true;
				}

				this.raccoon.forEach((raccoon) => {
					//if the raccoon is alive and the key is pressed, it will move at a certain speed
					//determines if the raccoon hits a wall and stops the movement
					if (raccoon.isAlive) {
						let newX = raccoon.x;
						let newY = raccoon.y;

						if (keys["KeyW"]) newY -= raccoon.speed * dt;
						if (keys["KeyS"]) newY += raccoon.speed * dt;
						if (keys["KeyA"]) newX -= raccoon.speed * dt;
						if (keys["KeyD"]) newX += raccoon.speed * dt;

						const radius = raccoon.size / 2;
						newX = Math.min(width - radius, Math.max(radius, newX));
						newY = Math.min(height - radius, Math.max(radius, newY));

						// checks if movement would result in a collision with an obstacle (AKA rock)
						const collidesWithRock = this.rocks.some((rock) =>
							isColliding({ x: newX, y: newY, size: raccoon.size }, rock)
						);

						if (!collidesWithRock) {
							raccoon.x = newX;
							raccoon.y = newY;
						}
						//counting score when colliding with trash
						const beforeCount = this.trash.length;
						this.trash = this.trash.filter(
							(trash) => !isColliding(raccoon, trash)
						);
						const afterCount = this.trash.length;
						this.score += beforeCount - afterCount;
						setScore(this.score);
					}
				});
				if (this.hasRaccoonMoved) {
					startTime = performance.now();
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
				}
			},

			//renders the canvas
			render(ctx) {
				ctx.clearRect(0, 0, width, height);
				//rendering the obstacles (AKA rocks)
				this.rocks.forEach((rock) => {
					const size = rock.size;
					if (rockImageLoaded) {
						ctx.drawImage(
							rockImage,
							rock.x - size / 2,
							rock.y - size / 2,
							size,
							size
						);
					} else {
						//in case icon doesn't load
						ctx.fillStyle = "brown";
						ctx.fillRect(rock.x - size / 2, rock.y - size / 2, size, size);
					}
				});
				//rendering the raccoon on the canvas
				this.raccoon.forEach((raccoon) => {
					const size = raccoon.size;
					if (raccoonImageLoaded) {
						ctx.drawImage(
							raccoonImage,
							raccoon.x - size / 2,
							raccoon.y - size / 2,
							size,
							size
						);
					} else {
						ctx.fillStyle = "grey";
						ctx.fillRect(
							raccoon.x - size / 2,
							raccoon.y - size / 2,
							size,
							size
						);
					}
				});
				//rendering the trash on the canvas
				this.trash.forEach((trash) => {
					const size = trash.size;
					if (trashImageLoaded) {
						ctx.drawImage(
							trashImage,
							trash.x - size / 2,
							trash.y - size / 2,
							size,
							size
						);
					} else {
						ctx.fillStyle = "red";
						ctx.fillRect(trash.x - size / 2, trash.y - size / 2, size, size);
					}
				});
				if (this.trash.length < 1) {
  					setTime(totalSeconds);
					const addToLeaderBoards = async() => {
						const response = await fetch(`http://localhost:3000/score`, {
							method: "POST",
							headers: {'Content-Type':'application/json',
								Authorization: `Bearer ${token}`
							},
							body: JSON.stringify({ score: totalSeconds })

						});
						const result = await response.json();
					}
					addToLeaderBoards()
					
					checkMilestoneAchievements(totalSeconds);
					
					navigate("/gameover");
				};
			}}

		let frameId;

		//loop constantly refreshes the frame to keep the game running and updating
		function loop(now) {
			const dti = now - engine.lastTime;
			const dt = dti / 1000;
			totalSeconds = Math.floor(((dti + startTime) / 1000) * 100) / 100;
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
