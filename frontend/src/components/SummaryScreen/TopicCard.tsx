import React from "react";

export const TopicCard = ({ topic }: any) => {
  const isWeak = topic.accuracy < 60;

  return (
    <div className="topicCard flexC gap2">
      <span className="fM">{topic.topic}</span>

      <div className={`progressBar ${isWeak ? "red" : ""}`}>
        <div style={{ width: `${topic.accuracy}%` }} />
      </div>

      <span className="fXS color2">
        {topic.accuracy}% Accuracy
      </span>
      <span className="fXS color2">
        {topic.avgTime} Average time
      </span>

    </div>
  );
};
