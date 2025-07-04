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
        const result = await fetch(`http://localhost:3000/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await result.json();
        setUser(data);
      } catch (error) {
        console.error("Error loading user details: ", error);
      }
    }
    getUser();
  }, []);

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