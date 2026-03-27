import React from "react";
import { Link, useNavigate } from "react-router";
/* =========================
   TYPES
========================= */

export type SessionOutcome =
  | "Strong answers"
  | "Good clarity"
  | "Needs improvement";

export interface Session {
  interviewId: string;
  roleType: any;
  subjects: string[]
  topics: string[];
  totalQuestions: number;
  totalCorrect: number;
  feedback: string;
  outcome: SessionOutcome;
  status: "completed" | "incomplete";
  createdAt: string;
}

/* =========================
   SESSION CARD
========================= */

interface SessionCardProps {
  session: Session;
  handleClick: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  handleClick
}) => {
  const {
    interviewId,
    roleType,
    subjects,
    topics,
    totalQuestions,
    totalCorrect,
    feedback,
    outcome,
    createdAt
  } = session;

  return (
    <div
      className="session-card pointer bg3"
      onClick={handleClick}
    >
      <div className="bg1 visual padY3 padX3 flexC gap1  justifyC roundTop">
        
        <strong className=" fM">
          {roleType} . {subjects}
        </strong>
        

        <div className="session-topics textSecondary">
          Topics: {topics.join(" · ")}
        </div>
        <div className="color2">Questions: <span className="color1">{totalQuestions}</span></div>
      </div>
     
      <div className="flexC gap1 bg3 roundBottom padX3 padY3">
          <div className="color2">Correct: <span className="color4">{totalCorrect}</span></div>
      
          <p className="session-feedback textSecondary">
            {feedback}
          </p>

          <div className="flex alignC justifyB gap1">
            <span className={`outcome-tag ${outcomeClass(outcome)}`}>
              {outcome}
            </span>
            <span className="fXS color2">
              {createdAt}
            </span>
          </div>
      </div>
      
    </div>
  );
};

/* =========================
   RECENT SESSIONS LIST
========================= */

interface RecentSessionsProps {
  sessions?: Session[];
  onSessionClick?: (id: string) => void;
}

export const RecentSessions: React.FC<RecentSessionsProps> = ({
  sessions=[],
}) => {

  const navigate = useNavigate()

  if (!sessions.length) {
    return (
      <section className="recent-sessions">
        <h3>Recent interview sessions</h3>
        <div className="card subtle textSecondary">
          You haven’t completed any interviews yet.
        </div>
      </section>
    );
  }

  return (
    <section className="recent-sessions flexC gap3">
      <div className="flex justifyB">
        <h3 className="fL">Recent interview sessions</h3>
        <Link to="/" className="hoverEffect">View all sessions</Link>
      </div>
      <div className="recentSessionGrid">
        {sessions.map((session) => (
          <SessionCard
            key={session.interviewId}
            session={session}
            handleClick={() => navigate(`/interview/${session.interviewId}/summary`)}
          />
        ))}
      </div>
    </section>
  );
};

/* =========================
   HELPERS
========================= */

function outcomeClass(outcome: SessionOutcome): string {
  switch (outcome) {
    case "Strong answers":
      return "outcome-strong";
    case "Good clarity":
      return "outcome-good";
    case "Needs improvement":
      return "outcome-weak";
    default:
      return "outcome-neutral";
  }
}
