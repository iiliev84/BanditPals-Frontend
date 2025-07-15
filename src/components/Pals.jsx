import { React, useEffect } from "react";
import pals from "../assets/pals.png";
import { useNavigate } from "react-router-dom";

const Pals = () => {
    return (
        <>
            <div className="pals">
                <div className="pals">
                    <h1>Meet the Pals!</h1>
                    <img className="palsimg" src={pals} alt="BP" />
                    <p className="palInfo"> Founding Pals is a remote dev team from Fullstack Academy collaborating to build Bandit Pals, a 2D browser-based game, along with its custom game engine. The game engine was developed through pair programming, allowing team members to tackle complex challenges collaboratively and ensure a solid technical foundation. Each member also takes on individual responsibilities—ranging from frontend design to backend architecture and database integration—while actively supporting one another to deliver a cohesive and polished final product. </p>
                </div>
            </div>
        </>
    );
};

export default Pals;