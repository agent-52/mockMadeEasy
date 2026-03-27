export const GapAnalysisCard = () => {
  return (
    <div className="card dark-card pad5">

      <h3>Gap Analysis</h3>

      <div className="flex gap4">

        <div className="stat-card">
          <h4>Precision</h4>
          <div className="big-number green">82%</div>
        </div>

        <div className="stat-card">
          <h4>Structure</h4>
          <div className="big-number green">88%</div>
        </div>

      </div>

      <div className="missing-box">
        <h4>Missing Concepts</h4>
        <ul>
          <li>Module pattern</li>
          <li>Memory implications</li>
        </ul>
      </div>

    </div>
  );
};
