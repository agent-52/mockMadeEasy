import type { RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";

const SOLUTION_FEATURES = [
  {
    title: "Voice-first AI interviewer",
    desc: "Speak your answers naturally. The AI listens, comprehends, and asks intelligent follow-up questions.",
  },
  {
    title: "Real-time scoring",
    desc: "Get scored on technical accuracy, communication, problem-solving, and confidence as you answer.",
  },
  {
    title: "Instant structured feedback",
    desc: "Every session generates a full breakdown: what you got right, what you missed, and how to close the gap.",
  },
  {
    title: "Progress tracking",
    desc: "Compare scores across sessions. Watch your communication improve over time.",
  },
];

export function Solution() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as RefObject<HTMLElement>} className="section">
      <div className="section-inner">
        <div className="grid-2">
          <div className={`card-window ${sv(visible)}`}>
            <div className="window-chrome">
              {[0, 1, 2].map((i) => (
                <div key={i} className="window-dot-sm" />
              ))}
              <span className="window-title">Setup Your Interview</span>
            </div>
            <div className="setup-body">
              {[
                {
                  label: "Interview Type",
                  value: "Technical Screen",
                  tags: undefined,
                },
                {
                  label: "Experience Level",
                  value: "Mid-Level (3-5 yrs)",
                  tags: undefined,
                },
                {
                  label: "Focus Topics",
                  value: "",
                  tags: ["React", "TypeScript", "Node.js", "System Design"],
                },
                { label: "Duration", value: "45 minutes", tags: undefined },
              ].map(({ label, value, tags }) => (
                <div key={label} className="form-row">
                  <p className="form-field-label">{label}</p>
                  {tags ? (
                    <div className="form-tags">
                      {tags.map((t) => (
                        <span key={t} className="form-tag">
                          {t}
                        </span>
                      ))}
                      <span className="form-tag-add">+ Add</span>
                    </div>
                  ) : (
                    <div className="form-select-row">
                      <span className="form-select-value">{value}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6B6B6B"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              <button className="btn-white btn-full">
                Start Interview
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          <div className={sv(visible, "delay-d")}>
            <p className="label">The Solution</p>
            <h2 className="heading-xl">
              An AI that interviews you — and makes you better.
            </h2>
            <p className="body-lg">
              MockMadeEasy runs realistic voice-driven technical interviews,
              scores your performance in real time, and gives you the structured
              feedback you need to improve.
            </p>
            <div className="solution-features">
              {SOLUTION_FEATURES.map(({ title, desc }) => (
                <div key={title} className="solution-feature-item">
                  <div className="solution-feature-bar" />
                  <div>
                    <p className="solution-feature-title">{title}</p>
                    <p className="body-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
