import { useEffect, useState } from "react";
import GameEngine from "./GameEngine.jsx";

function Gameplay({ setScore, score, setTime, token }) {


  return (
    <GameEngine
      setScore={setScore}
      score={score}
      setTime={setTime}
      token={token}
    
    />
  );
}

export default Gameplay;
