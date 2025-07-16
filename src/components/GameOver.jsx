import over from "../assets/BPover.png";
import { useNavigate } from "react-router-dom";
import useSound from 'use-sound';
import oversound from '../assets/game-over.mp3';
import gameover from "../assets/gameover.png";

export default function GameOver({ time }) {
	const navigate = useNavigate();
	const [playGameOver] = useSound(oversound);
	playGameOver();
	return (
		<>
			<div className="gameover-container">
				<div className="gameover-content">
					<img className="overimg" src={over} alt="BPover" />
					<img className="tiredrac" src={gameover} alt="tiredrac" />
					<br></br>
					<br></br>
					<button
						className="play-button"
						onClick={() => {
							navigate("/game");
							window.location.reload();
						}}
					>
						Play Again
					</button>
					<h2>Your time: {time} seconds</h2>
				</div>
			</div>
		</>
	);
}
