import { useState, useEffect } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import './App.css'
import Register from './components/Register'
import LogIn from './components/Login'
import Navigations from './components/Navigations'
import Account from './components/Account'
import Home from './components/Home'
import Leaderboard from './components/Leaderboard'
import Gameplay from './components/Gameplay'
import GameOver from './components/GameOver'

function App() {

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <>
    <div>
      {<Navigations token={token} setToken={setToken}/>}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path='/login' element={<LogIn setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path='/users/me' element={<Account token={token} />} />
        <Route path='/account' element={token ? <Account token={token} /> : <Navigate to="/login" />} />
        <Route path='/leaderboard' element={<Leaderboard token={token} />} />
        <Route path='/game' element={token ? <Gameplay token={token} setScore={setScore} score={score} setTime={setTime}/>: <Navigate to="/" />} />
        <Route path='/gameover' element={<GameOver time={time}/>} />
      </Routes>
    </div>
    <div>

    </div>
    </>
  )
}

export default App