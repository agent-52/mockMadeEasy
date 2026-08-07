import type { RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";

export function QuestionReview() {
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
              <span className="window-title">Question Review · Session 8</span>
            </div>
            <div className="qr-q-nav">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  className={
                    n === 4
                      ? "qr-nav-btn current"
                      : n < 4
                        ? "qr-nav-btn done"
                        : "qr-nav-btn default"
                  }
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="qr-body">
              <p className="qr-block-label">Question 4</p>
              <div className="qr-question-box">
                <p className="qr-question-text">
                  Explain the difference between{" "}
                  <code className="code-tag">useEffect</code> and{" "}
                  <code className="code-tag">useLayoutEffect</code>.
                </p>
              </div>
              <div className="qr-header-row">
                <p className="qr-block-label">Your Answer</p>
                <span className="qr-score-tag warning">68 / 100</span>
              </div>
              <div className="qr-your-body">
                <p className="qr-answer-text">
                  useEffect runs after the render is painted to the screen.
                  useLayoutEffect runs before the paint. I typically use
                  useLayoutEffect when I need to measure DOM elements to avoid
                  flicker.
                </p>
              </div>
              <div className="qr-header-row">
                <p className="qr-block-label">Model Answer</p>
                <span className="qr-score-tag success">Reference</span>
              </div>
              <div className="qr-model-body">
                <p className="qr-model-text">
                  Both hooks run after React commits changes to the DOM.{" "}
                  <strong>useEffect</strong> fires asynchronously after the
                  browser paints. <strong>useLayoutEffect</strong> fires
                  synchronously before paint — essential for DOM measurements to
                  prevent visual flickering.
                </p>
              </div>
              <div className="qr-tags">
                {[
                  ["Timing: correct", "success"],
                  ["Use case: correct", "success"],
                  ["Async detail: missing", "warning"],
                  ["Examples: lacking", "warning"],
                ].map(([t, c]) => (
                  <span key={t} className={`qr-tag ${c}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={sv(visible, "delay-d")}>
            <p className="label">Question Review</p>
            <h2 className="heading-xl">
              Learn Exactly
              <br />
              Where You Lost Marks.
            </h2>
            <div className="qr-copy-items">
              {[
                {
                  title: "Side-by-side comparison",
                  desc: "Your answer placed directly beside the model answer. No guessing what you missed.",
                },
                {
                  title: "Annotated gap analysis",
                  desc: "Every missing detail, incorrect assumption, or weak explanation is labeled and explained.",
                },
                {
                  title: "Improve every session",
                  desc: "Review mode is available immediately after each session. The fastest way to improve is to understand your gaps.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="qr-bar-item">
                  <div className="qr-bar" />
                  <div>
                    <p className="qr-item-title">{title}</p>
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
