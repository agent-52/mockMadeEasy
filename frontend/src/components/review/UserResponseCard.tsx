export const UserResponseCard = () => {
  return (
    <div className="card dark-card pad5">

      <div className="flex justifyB alignC">
        <h3>Your Response</h3>
        <div className="meta">
          142 words · Confidence 85%
        </div>
      </div>

      <div className="answer-box">
        A closure is a function that has access to variables in its outer lexical scope...
      </div>

      <button className="btn-secondary small">Replay Audio</button>

    </div>
  );
};
