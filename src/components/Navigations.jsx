import { Link } from "react-router-dom";

export default function Navigations({ token, setToken }) {
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link className="nav-link" to="/">Home</Link>
        {token ? (
          <>
            <Link className="nav-link" to="/account">Account</Link>
            <Link className="nav-link" to="/game">Play</Link>
            <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
