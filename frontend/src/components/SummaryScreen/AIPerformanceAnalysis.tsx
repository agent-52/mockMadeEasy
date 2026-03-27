import React from "react";

export const AIPerformanceAnalysis = ({aiAnalysis}:{aiAnalysis:any}) => {
  return (
    <div className="card flexC gap3">
      <h2 className="fL">AI Performance Analysis</h2>
      
      {aiAnalysis.communicationClarity && <p>{aiAnalysis.communicationClarity}</p>}
      {aiAnalysis.confidenceLevel && <p>{aiAnalysis.confidenceLevel}</p>}
      {aiAnalysis.conceptDepth && <p>{aiAnalysis.conceptDepth}</p>}
      {aiAnalysis.LogicalThinking && <p>{aiAnalysis.LogicalThinking}</p>}
      {aiAnalysis.codeStructure && <p>{aiAnalysis.codeStructure}</p>}
    </div>
  );
};
