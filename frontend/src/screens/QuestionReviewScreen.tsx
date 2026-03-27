
import { QuestionSidebar } from "../components/review/QuestionSidebar";
import { QuestionHeader } from "../components/review/QuestionHeader";
import { UserResponseCard } from "../components/review/UserResponseCard";
import { IdealAnswerCard } from "../components/review/IdealAnswerCard";
import { AIEvaluationCard } from "../components/review/AIEvaluationCard";
import { GapAnalysisCard } from "../components/review/GapAnalysisCard";
import "../styles/QuestionReviewScreen.css"
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getQuestionsReview } from "../api/interview.api";


export const QuestionReviewScreen = () => {

  const {id} = useParams()
  const interviewId = Number(id)

  const {
    data,
    isLoading,
    isError
  } = useQuery({
    queryKey:["interview-review", interviewId],
    queryFn: () => getQuestionsReview(interviewId),
    enabled: !!interviewId,
    staleTime: 1000 * 60 * 5
  })

  if (isLoading) {
    return <div>Generating your review report ...</div>
  }
  if (isError) {
    return <div>Failed to load review</div>
  }
  if(!data){
    return <div>No review data found</div>
  }
  return (
    <div className="flex">

      <QuestionSidebar />

      <div className="  fullWidth flexC gap4 container pad5">

        <QuestionHeader />

        <UserResponseCard />

        <IdealAnswerCard />

        <AIEvaluationCard />

        <GapAnalysisCard />

      </div>
    </div>
  );
};
