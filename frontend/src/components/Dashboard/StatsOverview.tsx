import { BarChart2, CheckCircle, HelpCircle, Target } from "lucide-react";
import "../../dashboard.css"

export function StatsOverview({statsOverview}:any) {
  const stats = [
    { label: "Interviews completed", value: `${statsOverview.interviewsCompleted}`, icon:<CheckCircle color="#898989"/> },
    { label: "Primary focus", value: `${statsOverview.primaryFocus}`, icon:<Target color="#898989"/> },
    { label: "Avg clarity score", value: `${statsOverview.avgClarityScore} / 10` , icon:<BarChart2 color="#898989"/> },
    { label: "Weak area", value: `${statsOverview.weakArea}`, icon:<HelpCircle color="#898989"/> }
  ];

  return (
    <section className="stats-grid">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </section>
  );
}
export function StatCard({ label, value, icon }:{label:string, value:string, icon:any}) {
  return (
    <div className="stat-card flexC gap2">
      <div className="flex gap1 alignC">
        <div className="feature-icon">{icon}</div>
        <div className="stat-label">{label}</div>
      </div>
      <div className="stat-value fL padX2">{value}</div>
    </div>
  );
}
