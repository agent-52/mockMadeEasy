import type { RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";

const PROBLEMS = [
  {
    n: "01",
    title: "Reading is not rehearsing.",
    desc: "Leetcode tells you what to know. It doesn't tell you if you're communicating it clearly under pressure. Interviewers reject candidates who know the answer but can't explain it.",
  },
  {
    n: "02",
    title: "Mock interviews are hard to schedule.",
    desc: "Peer mocks depend on availability and mutual skill level. Career coaches are expensive. Most engineers practice alone — which means they never get the feedback that matters.",
  },
  {
    n: "03",
    title: "You don't know what's actually hurting you.",
    desc: "A generic rejection email tells you nothing. Without structured feedback, you repeat the same mistakes across every interview. You can't improve what you can't measure.",
  },
];

export function Problem() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as RefObject<HTMLElement>} className="section">
      <div className="section-inner">
        <div className={`section-header-left ${sv(visible)}`}>
          <p className="label">The Problem</p>
          <h2 className="heading-xl">
            The way engineers prepare for interviews is broken.
          </h2>
        </div>
        <div
          className="grid-4 grid-bordered"
          style={{ gridTemplateColumns: "repeat(3,1fr)" }}
        >
          {PROBLEMS.map(({ n, title, desc }, i) => (
            <div
              key={n}
              className={`problem-card ${sv(visible, `delay-${i}`)}`}
            >
              <p className="problem-num">{n}</p>
              <h3 className="heading-section-sm">{title}</h3>
              <p className="body-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
