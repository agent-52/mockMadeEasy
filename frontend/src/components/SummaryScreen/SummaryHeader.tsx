import React from "react";
import { useNavigate, useParams } from "react-router";



export const SummaryHeader = ({ data }: any) => {
  const navigate = useNavigate()
  const {id} = useParams()
  return (
    <div className="card flex justifyB alignC">
      <div>
        <h1 className="fXL">{data.roleType}</h1>
        <h2 className="fL">{data.subjects}</h2>
        <p className="color2">
          {data.date} • {data.duration} • {data.difficulty}
        </p>
      </div>

      <div className="flex gap2">
        <button className="btn-primary padX3 padY2" onClick={() => {
          navigate(`/interview/${id}/review`)
        }}>Review Answers</button>
        <button className="btn-secondary padX3 padY2">Start New</button>
      </div>
    </div>
  );
};
