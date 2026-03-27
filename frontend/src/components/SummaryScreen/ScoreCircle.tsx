export const ScoreCircle = ({ score }: { score: number }) => {
  return (
    <div
      className="scoreCircle flex alignC justifyC"
      style={{
        background: `conic-gradient(var(--accent-primary) ${score}%, #2e2e2e 0%)`,
      }}
    >
      <span className="fXL w600">{score}%</span>
    </div>
  );
};
