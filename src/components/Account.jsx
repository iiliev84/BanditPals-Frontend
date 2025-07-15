import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Account({ token }) {
  const [user, setUser] = useState(null);
  const [allAchievements, setAllAchievements] = useState();
  const [userAchievements, setUserAchievements] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

async function getUser() {
  try {
    const res = await fetch(`http://localhost:3000/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch user: ${res.status} - ${text}`);
    }
    
    const data = await res.json();
    data.sort((a,b) => a.score - b.score);
    setUser(data[0]);
  } catch (error) {
    console.error("Error loading user details: ", error);
  }
}
getUser();
  }, [token, navigate]);

//fetches all achievements from the db table
useEffect(()=>{
  async function getAllAchievements(){
    try{
      const res = await fetch(`http://localhost:3000/achievements/`);
        const result = await res.json();
        setAllAchievements(result);
      } catch (error){
        console.error(`Error loading achievements`, error)
      }
    }
    getAllAchievements();
  },[]) 


  //fetches user achievements
  useEffect(()=>{
  async function getUserAchievements(){
    try{
      const res = await fetch(`http://localhost:3000/achievements/user`,
        {headers: {Authorization: `Bearer ${token}`}}
      );
        const result = await res.json();
        setUserAchievements(result);
      } catch (error){
        console.error(`Error loading achievements`, error)
      }
    }
    getUserAchievements();
  },[token])
    

   return(
    <>
    <div className="account-container">
     {user ? (
    <>
      <h1>Account Details</h1>
      <h2>Username: {user.username} </h2>
      <h2>Highest Score: {user.score}</h2>
    </>
  ) : (
    <p>Loading account details...</p>
  )}
<div>
  <>
  <h2 className = "userAchievementsTitle">Unlocked Achievements:</h2>
  {
    userAchievements && userAchievements.map((userAchievement)=>(
      <div key={userAchievement.achievement_id} className="userAchievement">
          <h2>Achievement Id: {userAchievement.achievement_id}</h2>
          <p>Time Unlocked: {userAchievement.unlocked_at}</p>
      </div>
    ))
  }
  </>
</div>
</div>
<>
<h2 className="allAchievementsTitle">Available Achievements:</h2>
{
  allAchievements && allAchievements.map((achievement)=>(
    <div key = {achievement.id} className="achievement">
        <h2 className="achievementName">{achievement.name}</h2>
        <p className="achievementDescription">{achievement.description}</p>
        <p className="achievementId">Achievement Id: {achievement.id}</p>
    </div>
  )
  )
}
</>
</>
)
}