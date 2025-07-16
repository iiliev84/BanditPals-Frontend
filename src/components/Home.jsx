import { React, useEffect } from "react";
import homepage from "../assets/BPmain.png";
import logo from "../assets/BPlogo.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
	return (
		<>
			<div className="homepage-main">
				<div className="homepage-content">
					<img src={logo} alt="BPlogo" />
					<h2 className="HomeWelcome">Welcome to Bandit Pals!</h2>
					<p className="instructionsHeader">Ready to play? Start by registering or logging in! Click on the play tab at the top of the screen to start your next trash-filled adventure!</p>
				</div>
			</div>
		</>
	);
};

export default Home;
