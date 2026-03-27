import React from "react";
import { TopicCard } from "./TopicCard";

export const TopicBreakdown = ({ topics }: any) => {
  return (
    <div className="card flexC gap4">
      <h2 className="fL">Topic Breakdown</h2>
      <div className="flex gap4">
        {topics.map((t: any, i: number) => (
          <TopicCard key={i} topic={t} />
        ))}
      </div>
    </div>
  );
};
