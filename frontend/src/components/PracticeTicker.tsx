import {
  FaReact,
  FaNodeJs,
  FaLaptopCode,
  FaCode,
  FaDatabase,
  FaBrain,
  FaUserTie
} from "react-icons/fa";

import "../componentStyles/practiceTicker.css";

export function PracticeTicker() {
  const items = [
    { label: "Frontend Interviews", icon: <FaReact /> },
    { label: "Backend Interviews", icon: <FaNodeJs /> },
    { label: "Full Stack Interviews", icon: <FaLaptopCode /> },
    { label: "Coding Interviews", icon: <FaCode /> },
    { label: "DSA & Problem Solving", icon: <FaBrain /> },
    { label: "Database Concepts", icon: <FaDatabase /> },
    { label: "Behavioral Rounds", icon: <FaUserTie /> }
  ];

  // duplicate list for infinite scroll
  const loopItems = [...items, ...items];

  return (
    <div className="ticker-wrapper">
      <div className="ticker-track">
        {loopItems.map((item, index) => (
          <div className="ticker-item" key={index}>
            <span className="ticker-icon">{item.icon}</span>
            <span className="ticker-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
