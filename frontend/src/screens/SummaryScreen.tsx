
import { SummaryHeader } from "../components/SummaryScreen/SummaryHeader";
import { OverallPerformance } from "../components/SummaryScreen/OverallPerformance";
import { TopicBreakdown } from "../components/SummaryScreen/TopicBreakdown";
import { AIPerformanceAnalysis } from "../components/SummaryScreen/AIPerformanceAnalysis";
import { StrengthImprovement } from "../components/SummaryScreen/StrengthImprovement";
import { QuestionBreakdown } from "../components/SummaryScreen/QuestionBreakdown";
import { useParams, useSearchParams } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInterviewSummary } from "../api/interview.api";

export const SummaryScreen: React.FC = () => {

  const {id} = useParams()

  const {data: summary,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["interview-summary", id],
    queryFn: () => getInterviewSummary(Number(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  })

  if (isLoading) {
    return <div>Generating your interview report...</div>
  }
  if (isError) {
    return <div>Failed to load summary</div>
  }
  if(!summary){
    return <div>No summary found</div>
  }

  return (
    <div className="container padY5 flexC gap5">
      <SummaryHeader data={summary.header} />
      <OverallPerformance data={summary.overallPerformance} />
      <TopicBreakdown topics={summary.topicBreakdown} />
      <AIPerformanceAnalysis aiAnalysis={summary.aiAnalysis}/>
      <StrengthImprovement
        strengths={summary.strengths}
        improvements={summary.areasToImprove}
        recommendedFocus={summary.recommendedFocus}
      />
      {/* <QuestionBreakdown questions={summary.questions} /> */}
    </div>
  );
};
