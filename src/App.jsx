import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import Testimonial from './components/Testimonial/Testimonial';


export default function App() {
  return (
    <div className="app">
      <Header />

      {/* Hero Section */}
     <section className="section flex-col alignCenter justifyCenter " id='hero'>
        <div className="hero flex-col alignStart justifyCenter gap-8 minW2 noBreak">
          <div className='flex-col alignStart gap-1'>
            <h1 className="Bmedium tight-text huge">You’re not bad at interviews, </h1>
            <h1 className="Bmedium tight-text huge">just under-practiced.</h1>
          </div>
          <div className="large cW3 Bmedium maxW55 flex-col alignStart gap-2">
            <p >
            Practice live coding interviews
            </p>
            <p> with an AI that asks, listens, and gives feedback.</p>
          </div>
          
          <div className="button-row gap-2 flex alignC justifyCenter gap-4 mgT0">
            <button className="btn  white-btn slight normal Bmedium">Start Practising 👉</button>
            <button className="btn transparent-btn normal">See How It Works {">"}</button>
          </div>
        </div>
      </section>

      <section className=" platform-preview ">
        
          <div className="platform-mockup">
            
            <iframe 
              src="/mockup.html" 
              width="100%" 
              height="950"
              frameBorder={0}
              title="AI Interview Platform Preview"
            ></iframe>
            
          </div>
        
      </section>

      {/* Features Section */}
       <section className="section mgT9 flex-col gap-12" id='features'>
        <div className="flex alignC justify-center gap6 alignCenter">
          <div className='flex-col gap-1 alignEnd'>
            <h2 className='Bmedium tight-text huge minW noBreak'>Replicate the Real.</h2>
            <h2 className='Bmedium tight-text huge minW noBreak'>Prepare with Precision</h2>
          </div>
          <div>
            <p className='maxW55 normal cW2 Bmedium' style={{lineHeight: "1.4rem"}}>Our platform goes beyond generic question banks. By replicating the environment, dialogue, and pressure of actual interviews, we help you build the confidence and competence required to succeed.</p>
          </div>
        </div>
        <div className="features_mockup flex alignCenter justify-center">
              
          <div className="mockup-container" style={{width: "80%", height: "950px"}}>
            <iframe 
            src="/ai_interview_timeline.html" 
            width="100%" 
            height="950"
            frameBorder={0}
            title="AI Interview Platform Preview"
          ></iframe>
          </div>
              
        </div>
        
          
        
      </section>

      {/* How It Works Section */}

      <section className="section flex-col alignCenter justifyCenter mgT3" id='how-it-works'>
        <div className="hero flex-col alignStart justifyCenter gap-8 minW2 ">
          <div className='flex-col alignStart gap-1'>
            <h1 className="Bmedium tight-text huge">How It Works </h1>
            
          </div>
          
          <p className='maxW55 normal cW2 Bmedium ' style={{lineHeight: "1.4rem"}}>Our platform simulates real interview environments with intelligent AI that listens, adapts, and gives feedback like a real human would.</p>
          

          <div className="steps">
            <div className='flex '>
                <div className="step flex-col alignStart gap-4 pB3 borderType1">
                  <h3 className='large'>Choose Your Interview Mode</h3>
                  <p className='maxW55 normal cW2' style={{lineHeight: "1.4rem"}}>
                    Pick from company-specific mock interviews (Google, TCS, startups) or build your own custom set by selecting topics and difficulty levels. Tailor it to fit your journey.
                  </p>
                  <div className="imgBox_hiw">
                    <img src="/images/hiw2_1.png" alt="" />
                  </div>
                </div>
                <div className="step flex-col alignStart gap-4 pB3 borderType2 p12">
                  <h3 className='large'> Meet Your AI Interviewer</h3>
                  <p className='maxW55 normal cW2' style={{lineHeight: "1.4rem"}}>
                    The session begins just like a real interview. The AI welcomes you, walks through introductions, and flows naturally into tailored questions and follow-ups.
                  </p>
                  <div className="imgBox_hiw">
                    <img src="/images/hiw3_1.png" alt="" />
                  </div>
                </div>
            </div>
            <div className="flex">
              <div className="step flex-col alignStart gap-4  pB3 borderType1" style={{borderTop: "0px"}}>
                <h3 className='large'> Speak and Code in Real Time</h3>
                <p className='maxW55 normal cW2' style={{lineHeight: "1.4rem"}}>
                  Answer out loud while writing code in the built-in editor. The AI listens, adapts, and evaluates your thinking — just like a human interviewer.
                </p>
                <div className="imgBox_hiw mgT1 flex justify-start">
                    <img src="/images/hiw1.png" alt="" />
                </div>
              </div>
              <div className="step flex-col alignStart gap-4 pB3 borderType2 p12" style={{borderTop: "0px"}}>
                <h3 className='large'> Get Detailed Feedback</h3>
                <p className='maxW55 normal cW2' style={{lineHeight: "1.4rem"}}>
                  Receive in-depth verbal and written feedback on your code quality, structure, communication, and problem-solving. Know what to improve, and how.
                </p>
                <div className="imgBox_hiw mgT1 flex justify-start">
                    <img src="/images/hiw4.png" alt="" />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="section testimonials mgT9 flex-col alignCenter">
        <div className='minW2'>
          <div className="flex-col alignStart gap1">
          
            <div className="Bmedium tight-text huge ">What Users Are Saying</div>
            <div className="maxW55 normal cW2 Bmedium  ">Reviews of users who have used this platform for their needs</div>
          </div>
        </div>
        <Testimonial />
        
      </section>

      {/* CTA Section */}
      <section className="section cta mgT9 flex-col alignCenter">
        <div className="minW2 flex-col gap2">
          <div className="flex-col gap1">
            <h2 className="Bmedium tight-text huge ">Train Smarter, Interview Better</h2>
            <p className=" normal cW2 Bmedium ">Skip the guesswork. Practice real interviews, whenever you want.</p>
          </div>
          <button className="btn  white-btn slight normal Bmedium">Start Practising Now 👉</button>
        </div>
        
         
      </section>

      <Footer />
    </div>
  );
}