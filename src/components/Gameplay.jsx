import { useEffect, useState } from "react";
import GameEngine from "./GameEngine.jsx";

function Gameplay({ setScore, score, setTime, token }) {


  return (
    <div>
      <h2 className="playInstructions">The game starts once you move the raccoon with the WASD keys! Collect the trash as fast as you can!!</h2>
    <GameEngine
      setScore={setScore}
      score={score}
      setTime={setTime}
      token={token}
      
      />
      </div>
  );
}

export default Gameplay;
