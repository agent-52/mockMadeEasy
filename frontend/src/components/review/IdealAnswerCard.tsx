export const IdealAnswerCard = () => {
  return (
    <div className="card dark-card pad5">

      <div className="flex justifyB">
        <h3>Ideal Answer Structure</h3>
        <span className="collapse">Collapse</span>
      </div>

      <ul className="list green-list">
        <li>Define closure</li>
        <li>Explain lexical scope</li>
        <li>Provide example</li>
        <li>Discuss practical use cases</li>
      </ul>

      <div className="tag-group">
        <span className="tag">Lexical Scope</span>
        <span className="tag">Data Privacy</span>
        <span className="tag">Memory Reference</span>
      </div>

    </div>
  );
};
