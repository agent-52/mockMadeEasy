import type { RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";
import {
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RADAR_DATA = [
  { subject: "Technical", A: 88 },
  { subject: "Communication", A: 74 },
  { subject: "Problem Solving", A: 81 },
  { subject: "Confidence", A: 69 },
  { subject: "Code Quality", A: 77 },
  { subject: "System Design", A: 65 },
];
const LINE_DATA = [
  { s: "S1", v: 52 },
  { s: "S2", v: 58 },
  { s: "S3", v: 61 },
  { s: "S4", v: 67 },
  { s: "S5", v: 72 },
  { s: "S6", v: 74 },
  { s: "S7", v: 79 },
  { s: "S8", v: 84 },
];
const ANALYTICS_STATS = [
  { label: "Overall Score", value: "84", sub: "+32 pts from session 1" },
  { label: "Sessions Completed", value: "8", sub: "~47 min avg duration" },
  { label: "Top Skill", value: "Technical", sub: "88 / 100 avg" },
  { label: "Biggest Gain", value: "Confidence", sub: "+28 pts improved" },
  { label: "Questions Answered", value: "64", sub: "Across 6 topic areas" },
  { label: "Streak", value: "5 days", sub: "Current practice streak" },
];

export function Analytics() {
  const { ref, visible } = useInView();
  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      id="analytics"
      className="section"
    >
      <div className="section-inner">
        <div className={`section-header ${sv(visible)}`}>
          <p className="label">Analytics</p>
          <h2 className="heading-xl">
            Track every dimension
            <br />
            of your performance.
          </h2>
        </div>
        <div className="grid-charts">
          <div className={`chart-card ${sv(visible)}`}>
            <p className="chart-title">Performance Breakdown</p>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#1A1A1A" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#6B6B6B", fontSize: 11 }}
                />
                <Radar
                  dataKey="A"
                  stroke="#FFFFFF"
                  fill="#FFFFFF"
                  fillOpacity={0.06}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className={`chart-card ${sv(visible, "delay-1")}`}>
            <p className="chart-title">Score Over Time</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={LINE_DATA}>
                <XAxis
                  dataKey="s"
                  stroke="#2A2A2A"
                  tick={{ fill: "#6B6B6B", fontSize: 11 }}
                  axisLine={{ stroke: "#1A1A1A" }}
                />
                <YAxis
                  domain={[40, 100]}
                  stroke="#2A2A2A"
                  tick={{ fill: "#6B6B6B", fontSize: 11 }}
                  axisLine={{ stroke: "#1A1A1A" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111",
                    border: "1px solid #242424",
                    borderRadius: "8px",
                    color: "#EDEDED",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  dot={{ fill: "#FFFFFF", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid-stats-tiles grid-bordered">
          {ANALYTICS_STATS.map(({ label, value, sub }, i) => (
            <div
              key={label}
              className={`analytics-tile ${sv(visible, `delay-${i}`)}`}
            >
              <p className="analytics-tile-label">{label}</p>
              <p className="analytics-tile-value">{value}</p>
              <p className="analytics-tile-sub">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
