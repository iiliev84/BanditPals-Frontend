import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Account({ token }) {
  const [user, setUser] = useState(null);
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
    console.log(data)
    data.sort((a,b) => a.score - b.score);
    setUser(data[0]);
  } catch (error) {
    console.error("Error loading user details: ", error);
  }
}
getUser();
  }, [token, navigate]);


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
</div>
</>
)
}