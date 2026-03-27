import { ScoreCircle } from "./ScoreCircle";

export const OverallPerformance = ({ data }: any) => {
  return (
    <div className="card flexC gap4">
      <h2 className="fL">Overall Performance</h2>

      <div className="flex justifyB alignC">
        <ScoreCircle score={data.accuracy} />

        <div className="flex gap5">
          <Metric label="Total" value={data.totalQuestions} />
          <Metric label="Correct" value={data.correct} />
          <Metric label="Incorrect" value={data.incorrect} />
          <Metric label="Avg Time" value={data.avgTime} />
          <Metric label="improvement from last session" value={data.improvementFromLastSession} />
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value }: any) => (
  <div className="flexC gap1">
    <span className="fXS color2">{label}</span>
    <span className="fM">{value}</span>
  </div>
);



