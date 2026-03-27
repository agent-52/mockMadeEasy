export const QuestionHeader = () => {
  return (
    <div className="card dark-card pad5">

      <div className="flex alignC justifyB">

        <div>
          <span className="badge medium">Medium</span>
          <span className="badge topic">JavaScript</span>
        </div>

        <div className="status correct">Correct</div>
      </div>

      <h2 className="question-title">
        Explain the concept of closure in JavaScript and provide a practical use case.
      </h2>

      <div className="flex alignC gap4">
        <span>2m 10s</span>
        <span>Score: 8/10</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill w80"></div>
      </div>

    </div>
  );
};
