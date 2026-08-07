import { useState, type RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";

const FAQS = [
  {
    q: "How realistic are the interviews?",
    a: "MockMadeEasy uses GPT-4o to conduct interviews that closely mirror real technical screening and panel interviews at top tech companies. The AI asks context-aware follow-ups, challenges vague answers, and calibrates difficulty to your stated experience level.",
  },
  {
    q: "Can I practice coding problems?",
    a: "Yes. The coding interview mode gives you an in-browser IDE with syntax highlighting, auto-completion, and code execution. After you submit, the AI reviews your solution for correctness, time complexity, space complexity, edge cases, and code readability.",
  },
  {
    q: "Can I resume an interview I started?",
    a: "Absolutely. Sessions are saved automatically after every question. You can close the browser, come back hours later, and pick up exactly where you left off — including the AI's full context of your previous answers.",
  },
  {
    q: "How does the AI evaluate my answers?",
    a: "Each answer is scored across four dimensions: technical accuracy, communication clarity, problem-solving approach, and confidence. You receive a numeric score for each dimension plus qualitative feedback. Every session generates a full PDF report.",
  },
  {
    q: "Can I choose which topics to practice?",
    a: "Yes. Choose from predefined tracks (Frontend, Backend, Full Stack, DSA, System Design) or build a custom topic list. Topic-specific practice mode is also available to drill a single area.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { ref, visible } = useInView();
  return (
    <section ref={ref as RefObject<HTMLElement>} id="faq" className="section">
      <div className="section-inner">
        <div className="grid-faq">
          <div className={`faq-sticky ${sv(visible)}`}>
            <p className="label">FAQ</p>
            <h2 className="heading-xl">
              Common
              <br />
              Questions
            </h2>
            <p className="body-md">
              Still have questions?{" "}
              <a
                href="mailto:hello@mockmadeeasy.com"
                className="faq-email-link"
              >
                Email us
              </a>
            </p>
          </div>
          <div className={sv(visible, "delay-d")}>
            {FAQS.map(({ q, a }, i) => (
              <div key={q} className="faq-item">
                <button
                  className="faq-question-btn"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span
                    className={
                      open === i
                        ? "faq-question-text open"
                        : "faq-question-text"
                    }
                  >
                    {q}
                  </span>
                  <div
                    className={
                      open === i ? "faq-icon-btn open" : "faq-icon-btn"
                    }
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6B6B6B"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>
                {open === i && (
                  <div className="faq-answer">
                    <p className="faq-answer-text">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
