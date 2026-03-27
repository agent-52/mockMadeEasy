import React, { useState } from "react";

export const QuestionBreakdown = ({ questions }: any) => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="card flexC gap3">
      <h2 className="fL">Question Breakdown</h2>

      {questions.map((q: any) => (
        <div key={q.id} className="questionCard padY3">
          <div
            className="flex justifyB alignC pointer"
            onClick={() => setOpenId(openId === q.id ? null : q.id)}
          >
            <span className="fM">{q.question}</span>
            <span className="fXS color2">{q.time}</span>
          </div>

          {openId === q.id && (
            <div className="flexC gap3 padY3">
              <p><strong>Your Answer:</strong> {q.yourAnswer}</p>
              <p><strong>Ideal Answer:</strong> {q.idealAnswer}</p>
              <p><strong>Gap:</strong> {q.gap}</p>
              <p><strong>AI Feedback:</strong> {q.feedback}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
