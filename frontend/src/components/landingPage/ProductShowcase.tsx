import { useState, type RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";

const SHOWCASE_TABS = [
  "Live Interview",
  "Real-time Scoring",
  "AI Feedback",
  "Question Bank",
  "Analytics",
];
const SHOWCASE_CONTENT = [
  {
    title: "The interview feels real.",
    desc: "Voice-driven Q&A with intelligent follow-ups. The AI adapts to your answers and challenges vague or incomplete responses — just like a real interviewer would.",
  },
  {
    title: "Watch your score update live.",
    desc: "Four performance dimensions update in real time as you speak. You always know exactly where you stand before the session ends.",
  },
  {
    title: "Detailed feedback after every answer.",
    desc: "Strengths, gaps, and a model answer for every single question. Know exactly what you missed and why it matters.",
  },
  {
    title: "1,000+ curated questions.",
    desc: "Organized by role, level, and topic. Every question is tagged, filterable, and quality-reviewed — from basic React hooks to distributed systems design.",
  },
  {
    title: "Track your trajectory.",
    desc: "Session-over-session charts, topic breakdowns, and a clear picture of where you're improving — and where you're not.",
  },
];

export function ProductShowcase() {
  const { ref, visible } = useInView();
  const [active, setActive] = useState(0);
  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      id="product"
      className="section"
    >
      <div className="section-inner">
        <div className={`section-header ${sv(visible)}`}>
          <p className="label">Product</p>
          <h2 className="heading-xl">
            Everything you need
            <br />
            to nail the interview.
          </h2>
        </div>
        <div className="tab-bar">
          {SHOWCASE_TABS.map((t, i) => (
            <button
              key={t}
              className={i === active ? "tab-btn active" : "tab-btn"}
              onClick={() => setActive(i)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className={`showcase-grid ${sv(visible, "delay-1")}`}>
          <div className="card-window">
            <div className="window-chrome">
              {[0, 1, 2].map((i) => (
                <div key={i} className="window-dot-sm" />
              ))}
              <span className="window-title">{SHOWCASE_TABS[active]}</span>
            </div>
            <div className="showcase-screen-body">
              <p className="showcase-placeholder">
                {SHOWCASE_TABS[active]} interface preview
              </p>
            </div>
          </div>
          <div>
            <h3 className="heading-lg">{SHOWCASE_CONTENT[active].title}</h3>
            <p className="body-md">{SHOWCASE_CONTENT[active].desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
