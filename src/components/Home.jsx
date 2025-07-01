import { React, useEffect } from 'react'; 
import homepage from "../assets/BPmain.png";
import logo from "../assets/BPlogo.png";
import { useNavigate } from 'react-router-dom';

const Home = () => { 

  return (  
    <>
      <div className="homepage-main"> 
          
        <div className="homepage-content"> 
            <img src={logo} alt="BPlogo"/>
            <h2>Welcome to Bandit Pals!</h2> 
          </div>
        </div>
    
    </>
  );  
};  

export default Home;