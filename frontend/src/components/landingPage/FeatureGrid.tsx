import type { RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";

const FEATURES = [
  {
    icon: "🎤",
    title: "Voice-driven interviews",
    desc: "Speak your answers naturally. The AI hears you, understands context, and responds intelligently.",
  },
  {
    icon: "⚡",
    title: "Real-time scoring",
    desc: "Live performance scores update across four dimensions as you answer each question.",
  },
  {
    icon: "🧠",
    title: "Intelligent follow-ups",
    desc: "The AI asks context-aware follow-up questions based on your previous answers — not scripted.",
  },
  {
    icon: "📊",
    title: "Analytics dashboard",
    desc: "Session history, topic breakdowns, and trend charts so you can see your improvement clearly.",
  },
  {
    icon: "📝",
    title: "Question review mode",
    desc: "Side-by-side comparison of your answer and the model answer for every question.",
  },
  {
    icon: "🗂️",
    title: "1,000+ question bank",
    desc: "Frontend, backend, system design, DSA, behavioral — filtered by role, level, and topic.",
  },
  {
    icon: "💻",
    title: "Coding interview mode",
    desc: "In-browser IDE with execution, auto-complete, and AI code review after submission.",
  },
  {
    icon: "📄",
    title: "PDF session report",
    desc: "Full session report with scores, answer quality analysis, and improvement recommendations.",
  },
  {
    icon: "🎯",
    title: "Custom interview tracks",
    desc: "Predefined tracks for Frontend, Backend, Full Stack, DSA, and System Design roles.",
  },
  {
    icon: "🔁",
    title: "Session resume",
    desc: "Close your browser mid-interview and pick up exactly where you left off.",
  },
  {
    icon: "⏱️",
    title: "Timed mode",
    desc: "Practice under realistic time constraints. Enable pressure mode for 30-second response windows.",
  },
  {
    icon: "🏅",
    title: "Confidence scoring",
    desc: "Beyond technical accuracy — get scored on how confidently and clearly you communicate.",
  },
  {
    icon: "🔍",
    title: "Gap analysis",
    desc: "Every session surfaces specific knowledge gaps with links to targeted resources to close them.",
  },
  {
    icon: "🌐",
    title: "Multi-language support",
    desc: "Practice in Python, JavaScript, Java, Go, and more. Each language has its own question sets.",
  },
];

export function FeatureGrid() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as RefObject<HTMLElement>} className="section">
      <div className="section-inner">
        <div className={`section-header ${sv(visible)}`}>
          <p className="label">Features</p>
          <h2 className="heading-xl">
            Every tool you need.
            <br />
            Nothing you don&apos;t.
          </h2>
        </div>
        <div className="grid-4 grid-bordered">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className={`feature-card ${sv(visible, `delay-${i % 4}`)}`}
            >
              <span className="feature-icon">{icon}</span>
              <h4 className="feature-title">{title}</h4>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
