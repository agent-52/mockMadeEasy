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
              src="/src/assets/mockup.html" 
              width="100%" 
              height="950"
              frameBorder={0}
              title="AI Interview Platform Preview"
            ></iframe>
            
          </div>
        
      </section>

      {/* Features Section */}
      <section className="section mgT3 flex-col gap-12">
        <div className="flex alignC justify-center gap6 alignCenter">
          <div className='flex-col gap-1 alignEnd'>
            <h2 className='Bmedium tight-text huge minW noBreak'>Replicate the Real.</h2>
            <h2 className='Bmedium tight-text huge minW noBreak'>Prepare with Precision</h2>
          </div>
          <div>
            <p className='maxW55 normal cW2 Bmedium' style={{lineHeight: "1.4rem"}}>Our platform goes beyond generic question banks. By replicating the environment, dialogue, and pressure of actual interviews, we help you build the confidence and competence required to succeed.</p>
          </div>
        </div>
        <div className="features-list flex gap-2 justify-center" >
          <Card title='AI-Led Interviews' imgLInk='/public/images/deep-learning.png'/> 
          <Card title='Smart Coding Interface'/>
          <Card title='Verbal Feedback'/>
          <Card title='Custom & Company Mode'/>
        </div>
          
        
      </section>

      {/* How It Works Section */}
      <section className="section">
        <h2 className="semi-bold text-lg">How It Works</h2>
        <ol className="light gap-3">
          <li><strong>Step 1:</strong> Select your interview mode (Company / Custom)</li>
          <li><strong>Step 2:</strong> AI greets and begins interview flow — including intros and follow-ups</li>
          <li><strong>Step 3:</strong> Respond verbally and write code in the built-in window</li>
          <li><strong>Step 4:</strong> Receive voice and written feedback at the end of the session</li>
        </ol>
      </section>

      {/* Use Cases Section */}
      <section className="section">
        <h2 className="semi-bold text-lg">Who Is This For?</h2>
        <ul className="light gap-2">
          <li>👩‍💻 Aspiring software engineers</li>
          <li>🧠 Competitive coders</li>
          <li>🚀 Founders and early-stage hires</li>
          <li>🎯 Anyone preparing for real interviews</li>
        </ul>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials">
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