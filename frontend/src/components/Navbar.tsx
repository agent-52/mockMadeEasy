import { Link } from "react-router"
import {User} from "lucide-react"
import "../componentStyles/navbar.css"
export function Navbar(){
    return (
        <header className="navbar ">
            <div className="flex alignC">
                <div className="logoImgContainer"><img src="/images/logo.png" alt="" /></div>
                <div className="fM w500 ">InterEase</div>
            </div>
            <nav className="flex gap4 justifyC">
                <Link to="/dashboard" className="hoverEffect">Dashboard</Link>
                <Link to="/practice" className="hoverEffect">Practice</Link>
                <Link to="/sessions" className="hoverEffect">Sessions</Link>
                <Link to="/coding" className="hoverEffect">Coding</Link>
                <Link to="/feedback" className="hoverEffect">Feedback</Link>
            </nav>
            <div>
                <button className="profileButton">
                    <User size={18} color="#3ecf8e"/>
                </button>
            </div>
        </header>
    )
}