import type { RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";

export function FinalCTA() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as RefObject<HTMLElement>} className="section-lg">
      <div className={`final-cta-inner ${sv(visible)}`}>
        <p className="label">Get Started</p>
        <h2 className="heading-cta">
          Your Next Interview
          <br />
          Shouldn&apos;t Be Your
          <br />
          <span className="heading-cta-dim">First Practice.</span>
        </h2>
        <p className="final-cta-sub">
          Practice with AI. Improve every interview. Get hired faster.
        </p>
        <div className="final-cta-row">
          <button className="btn-white">
            Start Your First Interview
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
          <button className="btn-ghost">Explore Question Bank</button>
        </div>
        <p className="dim-note">
          No credit card required · 3 free interviews included · Cancel anytime
        </p>
      </div>
    </section>
  );
}
