import { Clock, Timer } from "lucide-react";
import { Button, ButtonWithImage } from "../Button";
import { useEffect } from "react";
import { interviewStore } from "../../store/interview.store";
export const InterviewHeader: React.FC<{
  interviewType: string;
  stackLabel: string;
  difficulty: string;
  interviewId: number;
  onExit: () => void;
}> = ({
  interviewType,
  stackLabel,
  difficulty,
  
}) => {
    const answeredCount = interviewStore((s:any) => s.answeredCount)
    const totalCount = interviewStore((s:any) => s.totalQuestions)
  
  function getTime(){
    const date = new Date()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return {minutes, seconds}
  }
  useEffect(() =>{
    const time = getTime()
    console.log(time.minutes, time.seconds)
  },[])
  
  return (
    <div className="session-header header alignC padY2 flex justifyB padX2 fM">
      <div className="flex gap1">
        <div className="fM">{interviewType} - </div>
        <div className="fM color4">{stackLabel}</div>
        
      </div>

      <div>
        Question <span className="color4">{answeredCount}</span> of {totalCount}
      </div>

      <div className="flex gap2">
        <Button onClickFn={() => {}} text={difficulty} paddingX={16} paddingY={5} className="btn-secondary" disabled={false}/>
        <div className="clock-wrapper flex alignC">
          <div className="feature-icon"><Timer/></div>
          <div className="color2 fS">time</div>
        </div>
      </div>
    </div>
  );
};