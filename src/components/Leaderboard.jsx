import { useEffect, useState } from "react";
import leaderboard from "../assets/leaderboard.png"

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch("http://localhost:3000/score");
        const data = await res.json();
        setLeaders(data);
        data.sort((a,b) => a.score - b.score)
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      }
    }
    fetchLeaders();
  }, []);


  return (
    <div className="leaderboard-container">
      <img className="LeaderboardImage" src={leaderboard} alt="leaderboard" />
      <h2 className="LeaderboardHeader">LEADERBOARD</h2>
      <table  className="table-container">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {leaders && leaders.map((entry, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}