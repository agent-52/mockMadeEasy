import { Brain, Database, Monitor, Server } from "lucide-react";
import type { JSX } from "react";
import { FaAngular, FaNodeJs, FaReact } from "react-icons/fa";
import { Link } from "react-router";


const topicIconMap: Record<string, JSX.Element> = {
    react: <FaReact />,
    angular: <FaAngular />,
    node: <FaNodeJs />,
    api: <Server />,
    backend: <Server />,
    dsa: <Brain />,
    database: <Database />,
    frontend: <Monitor />
};




export function RecommendedPractice({recommendations}:any) {
  

  return (
    <section className="flexC gap3 padY5">
    <h3 className="fL">Recommended practice</h3>
    <div className="recommended-grid gap3">
      {recommendations.map((rec:any, i:number) => (
        <RecommendationCard key={i} {...rec} />
      ))}
    </div>
    </section>
  );
}
export function RecommendationCard({ subject, subjectId, topics, reason }:{ subject:string, subjectId:number, topics:{topic:string, topicId: number}[], reason:string }) {
  return (
    <Link to="/" className="practiceCard">
        <div className="bg1 visual padY5 flex alignC justifyC roundTop">
            {topicIconMap[subject.toLowerCase()]}
        </div>
        <div className="flexC gap1 bg3 pad3 roundBottom">
            <strong className="fM flex gap1 ">
                <div>{subject} : </div>
                <div className="color2">{topics.map(t => t.topic).join(", ")}</div>
            </strong>
            <p className="color2 fS">{reason}</p>
            <div className="fXS color2 padY1 flex gap1 alignC practiceText">Practice this <span className="arrow"><ArrowDown /></span></div>
        </div>
        
    </Link>
  );
}

export const ArrowDown = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
  d="M5 12H19M19 12L14 7M19 12L14 17"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
  </svg>
);

export default ArrowDown;

