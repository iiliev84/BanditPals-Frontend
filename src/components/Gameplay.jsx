import GameEngine from "./GameEngine.jsx";

function Gameplay({setScore, score, setTime}) {
	return (
		<>
			<GameEngine setScore={setScore} score={score} setTime={setTime}></GameEngine>
		</>
	);
}

export default Gameplay;
