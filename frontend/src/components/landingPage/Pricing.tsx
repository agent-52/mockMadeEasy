import type { RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";

const FREE_FEATURES = [
  "3 full interviews / month",
  "All question categories",
  "Basic scoring (overall)",
  "48-hour feedback turnaround",
  "Session history (last 3)",
];
const PRO_FEATURES = [
  "Unlimited interviews",
  "All question categories",
  "Full 4-dimension scoring",
  "Instant detailed feedback",
  "Full session history",
  "PDF session reports",
  "Analytics dashboard",
  "Priority support",
];

export function Pricing() {
  const { ref, visible } = useInView();
  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      id="pricing"
      className="section"
    >
      <div className="section-inner">
        <div className={`section-header ${sv(visible)}`}>
          <p className="label">Pricing</p>
          <h2 className="heading-xl">
            Simple pricing.
            <br />
            Serious results.
          </h2>
        </div>
        <div className={`grid-pricing ${sv(visible, "delay-1")}`}>
          <div className="card-pricing-free">
            <p className="pricing-card-title">Free</p>
            <div className="price-row">
              <span className="price-amount-dark">$0</span>
              <span className="price-period">/month</span>
            </div>
            <p className="pricing-sub">Start practicing with no commitment.</p>
            <button className="btn-ghost btn-full">Get started free</button>
            <div className="feature-list">
              {FREE_FEATURES.map((f) => (
                <div key={f} className="feature-list-item">
                  <svg
                    className="feature-check"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="feature-list-text">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card-pricing-pro">
            <div className="pricing-card-header-row">
              <p className="pricing-card-title">Pro</p>
              <span className="pricing-popular-tag">Most popular</span>
            </div>
            <div className="price-row">
              <span className="price-amount-light">$19</span>
              <span className="price-period">/month</span>
            </div>
            <p className="pricing-sub-light">
              For engineers serious about getting hired.
            </p>
            <button className="btn-dark">Start Pro trial</button>
            <div className="feature-list">
              {PRO_FEATURES.map((f) => (
                <div key={f} className="feature-list-item">
                  <svg
                    className="feature-check"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="feature-list-text-dark">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
