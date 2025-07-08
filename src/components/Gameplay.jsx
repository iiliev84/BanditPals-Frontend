import GameEngine from "./GameEngine.jsx";

function Gameplay({setScore, score}) {
	return (
		<>
			<GameEngine setScore={setScore} score={score}></GameEngine>
		</>
	);
}

export default Gameplay;
