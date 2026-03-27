import { Calendar, Clock } from "lucide-react"
import { Button } from './Button';

interface Session {
  id: string
  role: string
  stack: string
  difficulty: string
  mode: string
  score: number
  duration: number
  topics: string[]
  date: string
  performance: string
}

export const SessionCard = ({ session }: { session: Session }) => {

  function handleViewSummary(){

  }
  function handleReviewAnswers(){

  }
  function handleRetake(){

  }
  return (
    <div className="bg2 bR6 borderM pad4 flex justifyB ">

      {/* LEFT */}
      <div className="flexC gap2">
        <div className="flexC">
          <h3 className="fM">
            {session.role} {session.role != "Dsa" ? "Developer" : ""}
          </h3>
          <div className="color2">{session.stack}</div>
        </div>

        <div className="flexWrap gap2">
          <span className={`padX1 flex alignC justifyC textC bR6 fXS ${session.mode.toLowerCase()}`}>{session.mode}</span>
          <span className={`padX1 flex alignC justifyC textC bR6 fXS ${session.difficulty.toLowerCase()}`}>{session.difficulty}</span>
        </div>

        <div className="flex gap2 wrap">
          {session.topics.slice(0,3).map((t,i) => (
            <span key={i} className="bg3 padX2 padY0 borderM flex alignC justifyC textC bR6 fS">{t}</span>
          ))}
        </div>

        <div className="color2 fS flex gap3">
          <div className="flex gap1 alignC">
            <Calendar size={16} color="#898989" />
            <span>{session.date}</span>
          </div>
          <div className="flex gap1 alignC">
            <Clock size={16} color="#898989" />
            <span>{session.duration} min</span>
          </div>
        </div>
      </div>

      <div className="flex gap4">
      {/* CENTER */}
        <div className="flexC alignC gap2 marks padX4">
          <div className="fXL">
            {session.score} <span className="fM color2">/10</span>
          </div>
          <span className={`${session.performance.toLowerCase() == "strong"? "colorE": session.performance.toLowerCase() == "moderate"?"colorM":"colorH"}`}>
            {session.performance}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flexC gap2">
          <Button text="View Summary" className="btn-primary" paddingX={16} paddingY={8} disabled={false} onClickFn={handleViewSummary}/>
          <Button text="Review Answers" className="btn-secondary" paddingX={16} paddingY={8} disabled={false} onClickFn={handleReviewAnswers}/>
          <Button text="Retake" className="btn3" paddingX={16} paddingY={8} disabled={false} onClickFn={handleRetake}/>
        </div>
      </div>
    </div>
  )
}
