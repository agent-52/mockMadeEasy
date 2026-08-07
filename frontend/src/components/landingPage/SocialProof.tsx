import { useEffect, useState, type RefObject } from "react";
import { useInView } from "../../hooks/useInView";

function AnimatedStat({
  value,
  suffix,
  label,
  visible,
}: {
  value: number;
  suffix: string;
  label: string;
  visible: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const step = value / 60;
    const t = setInterval(() => {
      cur += step;
      if (cur >= value) {
        setCount(value);
        clearInterval(t);
      } else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [visible, value]);
  return (
    <div className="stat-item">
      <p className="stat-value">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

export function SocialProof() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as RefObject<HTMLElement>} className="section-sm">
      <div className="section-inner">
        <p className="trusted-label">Trusted by engineers from</p>
        <div className="companies-row">
          {[
            "Google",
            "Microsoft",
            "Amazon",
            "Meta",
            "Apple",
            "Stripe",
            "Figma",
            "Notion",
          ].map((c) => (
            <div key={c} className="company-badge">
              {c}
            </div>
          ))}
        </div>
        <div
          className={`grid-stats${visible ? " scroll-visible" : ""}`}
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease" }}
        >
          <AnimatedStat
            value={5000}
            suffix="+"
            label="Interviews completed"
            visible={visible}
          />
          <AnimatedStat
            value={94}
            suffix="%"
            label="Reported improvement"
            visible={visible}
          />
          <AnimatedStat
            value={1200}
            suffix="+"
            label="Questions in bank"
            visible={visible}
          />
        </div>
      </div>
    </section>
  );
}
