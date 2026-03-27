import React from "react";

export const StrengthImprovement = ({ strengths, improvements, recommendedFocus }: any) => {
  return (
    <div className="card flex gap5">
      <div>
        <h3 className="fM">Strengths</h3>
        <ul className="color2">
          {strengths.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="fM">Areas to Improve</h3>
        <ul className="color2">
          {improvements.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="fM">Recommended focus areas</h3>
        <ul className="color2">
          {recommendedFocus.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
