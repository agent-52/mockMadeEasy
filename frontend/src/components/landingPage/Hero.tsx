import { WideInterviewMockup } from "./InterviewMocup";

export function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="eyebrow-pill hero-anim-badge">
          <span className="eyebrow-label">Beta</span>
          <span className="eyebrow-text">
            Now in public beta · 5,000+ interviews completed
          </span>
        </div>

        <div className="hero-heading-wrap">
          <div className="hero-heading-glow" />
          <h1 className="hero-heading-text hero-anim-h1">
            Practice Interviews.
            <br />
            Get the Offer.
          </h1>
        </div>

        <p className="hero-subtitle hero-anim-sub">
          Voice-driven AI interviews that score your{" "}
          <em className="hero-subtitle-em">communication</em>,{" "}
          <em className="hero-subtitle-em">technical depth</em>, and
          problem-solving — just like the real thing.
        </p>

        <div className="hero-ctas-row hero-anim-ctas">
          <button className="btn-primary">
            Start Free Interview
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
          <button className="btn-secondary">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon
                points="10,8 16,12 10,16"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            Watch Demo
          </button>
        </div>

        <div className="hero-trust-row hero-anim-trust">
          {[
            "No credit card required",
            "1,000+ interview questions",
            "AI-evaluated answers",
          ].map((t) => (
            <div key={t} className="trust-item">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t}
            </div>
          ))}
        </div>

        <div className="hero-badges-row hero-anim-trust">
          {[
            "React",
            "Node.js",
            "System Design",
            "Database",
            "DSA",
            "Python",
            "Java",
          ].map((b) => (
            <span key={b} className="tech-badge">
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-mockup-outer hero-anim-mockup">
        <div className="hero-mockup-glow" />
        <WideInterviewMockup />
      </div>
      <div className="hero-spacer" />
    </section>
  );
}
