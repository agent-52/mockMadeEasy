import { interviewStore } from "../../store/interview.store";
import { Button } from "../Button";

export const ActionBar: React.FC<{
  
  onExit: () => void;
}> = ({ onExit }) => {
  const answeredCount = interviewStore((s:any) => s.answeredCount)
  const totalCount = interviewStore((s:any) => s.totalQuestions)
  
  return (
    <div className="action-bar padX4 flex justifyB alignC bg1">
      <div className="flexC gap1">
        <div className="flex gap1">
          <h3 className="fS">Progress : </h3>
          <p className="color2 fS">{answeredCount +1} of {totalCount} questions</p>
        </div>
        <div className="progress-bar-"></div>

      </div>
      <Button text="Exit Interview" paddingX={24} paddingY={10} className="btn-secondary" onClickFn={onExit} disabled={false}/>
      
    </div>
  );
};