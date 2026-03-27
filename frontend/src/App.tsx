import "./index.css"
import './utilities.css'
import "./App.css"
import { Header } from "./components/Header"
import { FeatureGrid } from "./components/FeatureGrid"
import { PracticeTicker } from "./components/PracticeTicker"
import { Button } from "./components/Button"
import { Link } from "react-router"
import { useEffect } from "react"
import { apiClient } from "./api/apiClient"
import { authStore } from "./store/auth.store"
function App() {
  
  const setIsAuthenticated = authStore((s:any) => s.setIsAuthenticated)
  const setIsChecking = authStore((s:any) => s.setIsChecking)

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response = await apiClient.get("/api/auth/refresh")
        if(response.status == 200){
          setIsAuthenticated(true)
        }
      } catch (error) {
        setIsAuthenticated(false)
      }finally{
        setIsChecking(false)
      }
    }

    checkAuthentication()
  }, [])
  return(
    <div id='app' className="">
      <Header />
      <section className="hero flexC alignC gap5">
        <div className="container ">
          <div className="hero-content flexC alignC gap5 padY5 ">
              <h1 className="fHero textCenter">
                AI-powered mock interviews
                <span className="color4"> for developers</span>
              </h1>

              <p className="fM color1 textCenter">
                Practice real interview questions, get structured AI feedback,
                and understand exactly where you need to improve.
              </p>

              <div className="flex gap2">
                
                <Link to="/dashboard"><Button className="btn-primary" paddingX={16} paddingY={10} text="Start practicing" onClickFn={() => {}} disabled={false}/></Link>
                <Button className="btn-secondary" paddingX={16} paddingY={10} text="View demo" onClickFn={() => {}} disabled={false}/>
                
              </div>
          </div>
          
        </div>
        <div className="container flexC gap5 alignC padY5">
          <PracticeTicker />
          <div className="color2 textCenter">Trusted by developers</div>
        </div>
      </section>

      <section className="padY5">  
        <FeatureGrid />
      </section>

      <section id="section2">
          <h2 className="fL textPrimary">
            A simple, structured interview flow
          </h2>
          <div className="stepContainer flexC">
            <div>
              <div className="fM">Choose what you want to practice</div>
              <p className="fS textSecondary">Select topics, difficulty, and interview style   based on what you want
              to prepare for.</p> 
              <video src=""></video>
            </div>
            <div>
              <div className="fM">Answer thoughtfully</div>
              <p className="fS textSecondary">Respond to questions in a focused, distraction-free environment designed
              to mirror real interviews.</p>
              <video src=""></video>
            </div>
            <div>
              <div className="fM">Review with AI feedback</div>
              <p className="fS textSecondary">See your responses alongside ideal answers and feedback that highlights
              gaps, strengths, and areas to work on.</p>
            </div>
            <video src=""></video>
          </div>
      </section>
      
      
      
      <section id="section6">
        <div className="container">
          <div>
            <h2>Join the community</h2>
            <p>Discover what fellow devplopers has to say about their InterEase expierence</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
