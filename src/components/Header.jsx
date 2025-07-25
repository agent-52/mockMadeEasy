import React from "react";
import "../App.css";

function Header() {
  return (
    <header className="header padding">
      <div className="logo flex justify-center">PrepVerse</div>
      <nav className="flex alignC justify-center gap-2 cW2 slight">
         <a href="#features" className=" minW "><button className="btn transparent-btn slight">Features</button></a>
       
        <a href="#how-it-works" className=" minW "><button className="btn transparent-btn slight">How it Works</button></a>
        <a href="#how-it-works" className=" minW "><button className="btn transparent-btn slight">Code Editor</button></a>
        <a href="#how-it-works" className=" minW "><button className="btn transparent-btn slight">Leaderboard</button></a>
        
      </nav>
      <div className="flex alignC justify-center gap-4">
        <button className="btn transparent-btn slight">Log in</button>
        <button className="btn  white-btn slight ">Sign Up</button>
      </div>
    </header>
  );
}

export default Header;
