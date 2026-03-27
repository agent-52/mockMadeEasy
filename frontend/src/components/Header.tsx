
import { Link } from "react-router"
import { Button } from "./Button"
const Header = () =>{
    return(
        <header className="header flex alignC gap2 fS padY1">
            <div className="flex alignC">
                <div className="logoImgContainer"><img src="/images/logo.png" alt="" /></div>
                <div className="fM w500 ">InterEase</div>
            </div>
            <div className="flex gap4">
                <div className="hDiv w400">Product</div>
                <div className="hDiv w400">Pricing</div>
                <div className="hDiv w400">Company</div>
                <div className="hDiv w400">Blog</div>
            </div>
            <div className="flex gap2">
                <Link to="/auth/login"><Button className="btn-secondary" paddingX={10} paddingY={5} text="Login" onClickFn={() =>{}} disabled={false}/></Link>
                <Link to="/auth/signup"><Button className="btn-primary" paddingX={10} paddingY={5} text="Signup" onClickFn={() =>{}} disabled={false}/></Link>
            </div>
        </header>
    )
}

export {Header}