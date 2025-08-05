import "./Testimonial.css"
import messageBoxVideo from "../../assets/3d-integrate-night.mp4"
import { useEffect } from "react"

import akhyai from "../../assets/testimonial/akhya.jpg"
import addui from "../../assets/testimonial/addu.jpg"
import piyushi from "../../assets/testimonial/piyush.jpg"
import sidi from "../../assets/testimonial/sid.jpg"
// import tanyai from "../assets/testimonial/tanya.jpg"
// import ujjwali from "../assets/testimonial/ujjwal.jpg"
// import sandeepi from "../assets/testimonial/sandeep.jpeg"
import shreyanshi from "../../assets/testimonial/shreyansh.jpg"

// let currentPage = 0




const Testimonial = () =>
{
  useEffect(()=>{
    const messageVideo = document.querySelector(".messageVideo")
    let currentPage = 0
    window.addEventListener("scroll", ()=>{
      const newPage = Math.round(scrollY/window.innerHeight)
      if(newPage !== currentPage){
        currentPage = newPage
        messageVideo.currentTime = 0
        messageVideo.play() 
        // console.log(currentPage, newPage)      
      }
    
    })
    
  },[])
  

  return(
    <div className="mgB5 flexC gap4">
      
      <div className="p2Main flex-col gap4">
        



          <div className=" text-sm testimonialBox flex gap2">

          <div className="testimonial flexC gap2">
            <div className="cW2">"I always struggled with the pressure of real interviews, especially when it came to speaking confidently. This platform helped me practice in a simulated environment that felt real — from the AI’s verbal questions to the instant feedback. I saw a clear improvement within just two weeks!"</div>
            <div className="flex gap1">
              <div className="imgBox"><img src={sidi} alt="" /></div>
              <div className="flexC justify-between">
                <div className="text-slate-12 font-medium1">Ankit M. </div>
                <div className="cW2">Aspiring Full Stack Developer</div>
              </div>
            </div>
          </div>
          
          <div className="testimonial flexC gap2">
            <div className="cW2">"The custom interview feature was a game-changer for me. I could choose the topics I was weak in, and the AI adapted instantly. Plus, the feedback on my speech and code wasn't just generic — it was actionable and really helpful."</div>
            <div className="flex gap1">
              <div className="imgBox"><img src={shreyanshi} alt="" /></div>
              <div className="flexC justify-between">
                <div className="text-slate-12 font-medium1">Shreyansg G. </div>
                <div className="cW2">Final Year CS Student</div>
              </div>
            </div>
          </div>

          

          <div className="testimonial flexC gap2">
            <div className="cW2">"I used the Google-mode interview prep before my actual interview — and it felt eerily similar. The coding window, the pressure simulation, and the follow-up questions really sharpened my responses. I’d recommend this to anyone preparing seriously."</div>
            <div className="flex gap1">
              <div className="imgBox"><img src={addui} alt="" /></div>
              <div className="flexC justify-between">
                <div className="text-slate-12 font-medium1">Aditya </div>
                <div className="cW2">Appeared at Google</div>
              </div>
            </div>
          </div>

          <div className="testimonial flexC gap2 ">
            <div className="cW2">"This is not just another coding platform. The AI interviewer actually feels like a human — it doesn’t just ask questions but engages with you, just like in a real interview. I was able to fix how I structure my answers, thanks to the feedback."</div>
            <div className="flex gap1">
              <div className="imgBox"><img src={akhyai} alt="" /></div>
              <div className="flexC justify-between">
                <div className="text-slate-12 font-medium1">Ritika S. </div>
                <div className="cW2">Recent Graduate</div>
              </div>
            </div>
          </div>

          <div className="testimonial flexC gap2">
            <div className="cW2">"The dark-themed UI is clean and calming, and the overall experience feels premium. I’ve done mock interviews on other platforms, but nothing matched the level of polish, realism, and insightful feedback like this one."</div>
            <div className="flex gap1">
              <div className="imgBox"><img src={piyushi} alt="" /></div>
              <div className="flexC justify-between">
                <div className="text-slate-12 font-medium1">Piyush S. </div>
                <div className="cW2">Full-Stack Bootcamp Student</div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default Testimonial