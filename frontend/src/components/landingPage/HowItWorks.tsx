import type { RefObject } from "react";
import { sv } from "../../common/sv";
import { useInView } from "../../hooks/useInView";

const STEPS = [
  {
    n: "01",
    title: "Configure your session",
    desc: "Choose interview type, experience level, topic focus, and duration. Over 1,000 questions across Frontend, Backend, System Design, DSA, and more.",
  },
  {
    n: "02",
    title: "Speak your answers",
    desc: "The AI asks questions. You respond by voice or text. It listens, understands context, and follows up intelligently — no scripted responses.",
  },
  {
    n: "03",
    title: "Get scored in real time",
    desc: "Live scoring updates across four dimensions: technical accuracy, communication clarity, problem-solving approach, and confidence.",
  },
  {
    n: "04",
    title: "Review and improve",
    desc: "After each session review every question with the model answer. Full PDF report included. Track trends over time on your analytics dashboard.",
  },
];

export function HowItWorks() {
  const { ref, visible } = useInView();
  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      id="how-it-works"
      className="section"
    >
      <div className="section-inner">
        <div className={`section-header ${sv(visible)}`}>
          <p className="label">How It Works</p>
          <h2 className="heading-xl">
            From setup to feedback
            <br />
            in under an hour.
          </h2>
        </div>
        <div className="grid-4 grid-bordered">
          {STEPS.map(({ n, title, desc }, i) => (
            <div key={n} className={`step-card ${sv(visible, `delay-${i}`)}`}>
              <div className="step-icon">
                <span className="step-num">{n}</span>
              </div>
              <h3 className="step-title">{title}</h3>
              <p className="step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
