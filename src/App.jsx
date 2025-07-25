import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';


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

      {/* Features Section */}
      <section className="section">
        <h2 className="semi-bold text-lg">Why Use This Platform?</h2>
        <div className="features-list gap-4">
          <div>
            <h3 className="bold">AI-Led Interviews</h3>
            <p className="light">Simulates real interviews with contextual follow-ups and dynamic verbal questioning.</p>
          </div>
          <div>
            <h3 className="bold">Smart Coding Interface</h3>
            <p className="light">Solve coding questions tailored to your chosen company or topics in an integrated window.</p>
          </div>
          <div>
            <h3 className="bold">Verbal Feedback</h3>
            <p className="light">Get detailed spoken feedback on your answers, speech delivery, and coding decisions.</p>
          </div>
          <div>
            <h3 className="bold">Custom & Company Mode</h3>
            <p className="light">Prepare for Google, TCS, or startups — or build your own interview from topics.</p>
          </div>
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