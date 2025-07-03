import GameEngine from "./GameEngine.jsx";

function Gameplay({setScore}) {
	return (
		<>
			<GameEngine setScore={setScore}></GameEngine>
		</>
	);
}

export default Gameplay;
