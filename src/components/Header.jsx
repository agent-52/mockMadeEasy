import React from "react";
import "../App.css";
import { Link, Element } from 'react-scroll';

function Header() {
  return (
    <header className="header padding">
      <a href="/"><div className="logo flex justify-center">PrepVerse</div></a>
      <nav className="flex alignC justify-center gap-2 cW2 slight">
         <Link to="features" smooth={true} className=" minW "><button className="btn transparent-btn slight">Features</button></Link>
       
        <Link to="how-it-works" smooth={true} className=" minW "><button className="btn transparent-btn slight">How it Works</button></Link>
        <Link to="how-it-works" smooth={true} className=" minW "><button className="btn transparent-btn slight">Code Editor</button></Link>
        <Link href="how-it-works" smooth={true} className=" minW "><button className="btn transparent-btn slight">Leaderboard</button></Link>
        
      </nav>
      <div className="flex alignC justify-center gap-4">
        <button className="btn transparent-btn slight">Log in</button>
        <button className="btn  white-btn slight ">Sign Up</button>
      </div>
    </header>
  );
}

export default Header;
