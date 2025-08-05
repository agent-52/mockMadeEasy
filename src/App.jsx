import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';

export default function App() {
  return (
    <div className="app">
      <Header />

      {/* Hero Section */}
      <section className="section flex-col alignCenter justifyCenter ">
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
            <button className="btn  white-btn slight normal Bmedium">Start Practising</button>
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
      <section className="section mgT9 flex-col gap-12">
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

      <section className="section flex-col alignCenter justifyCenter mgT3">
        <div className="hero flex-col alignStart justifyCenter gap-8 minW2 ">
          <div className='flex-col alignStart gap-1'>
            <h1 className="Bmedium tight-text huge">How It Works </h1>
            
          </div>
          
          <p className='maxW55 normal cW2 Bmedium ' style={{lineHeight: "1.4rem"}}>Our platform simulates real interview environments with intelligent AI that listens, adapts, and gives feedback like a real human would.</p>
          
          {/* how it works mockup */}
          
        
            
            
          


            <div className="steps">
              <div className="step">
                <h3>Step 1: Choose Your Interview Mode</h3>
                <p>
                  Pick from company-specific mock interviews (Google, TCS, startups) or build your own custom set by selecting topics and difficulty levels. Tailor it to fit your journey.
                </p>
              </div>
              <div className="step">
                <h3>Step 2: Meet Your AI Interviewer</h3>
                <p>
                  The session begins just like a real interview. The AI welcomes you, walks through introductions, and flows naturally into tailored questions and follow-ups.
                </p>
              </div>
              <div className="step">
                <h3>Step 3: Speak and Code in Real Time</h3>
                <p>
                  Answer out loud while writing code in the built-in editor. The AI listens, adapts, and evaluates your thinking — just like a human interviewer.
                </p>
              </div>
              <div className="step">
                <h3>Step 4: Get Detailed Feedback</h3>
                <p>
                  Receive in-depth verbal and written feedback on your code quality, structure, communication, and problem-solving. Know what to improve, and how.
                </p>
              </div>
            </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="section testimonials mgT9">
        <h2 className="semi-bold text-lg">What Users Are Saying</h2>
        <blockquote className="light">"This felt like a real Google interview — except I could replay and learn from my mistakes!"</blockquote>
        <blockquote className="light">"I used this daily for a week before my Meta round. It paid off!"</blockquote>
      </section>

      {/* CTA Section */}
      <section className="section cta">
        <h2 className="bold text-lg">Train Smarter, Interview Better</h2>
        <p className="light">Skip the guesswork. Practice real interviews, whenever you want.</p>
        <button className="white-btn">Get Started Free</button>
      </section>

      <Footer />
    </div>
  );
}