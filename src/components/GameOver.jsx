import over from "../assets/BPover.png";
import { useNavigate } from "react-router-dom";

export default function GameOver({ time }) {
	const navigate = useNavigate();
	return (
		<>
			<div className="gameover-container">
				<div className="gameover-content">
					<img src={over} alt="BPover" />
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
