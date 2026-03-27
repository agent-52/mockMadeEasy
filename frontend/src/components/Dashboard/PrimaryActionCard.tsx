import { Link, useNavigate } from "react-router";
import { Button } from "../Button";

export function PrimaryActionCard({primaryAction}:{primaryAction:{hasOngoingSession:boolean, ongoingInterviewId:any}}) {
  
  const navigate = useNavigate()

  return (
    <section className="flexC alignC gap3 padY5">
      <div className="flexC alignC">
        <h2 className="fXL">Start your next interview</h2>
        <p className="textSecondary">
            Pick an interview type and practice explaining your answers with clarity and confidence.
        </p>
      </div>
      <div className="flex gap3">
        
            <Link to="/interview/setup"><Button className="btn-primary" paddingX={16} paddingY={10} text="Start practicing" onClickFn={() => {}} disabled={false}/></Link>
            {primaryAction.hasOngoingSession && primaryAction.ongoingInterviewId && (
                <Button className="btn-secondary" paddingX={16} paddingY={10} text="Resume session" onClickFn={() => {navigate(`/interview/session/${primaryAction.ongoingInterviewId}/`)}} disabled={false}/>
            )}
            
        
        </div>

    </section>
  );
}
