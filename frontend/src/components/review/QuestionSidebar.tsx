import { Check } from "lucide-react";

export const QuestionSidebar = () => {
  return (
    <div className="sidebar borderR padY4 alignC flexC gap3">

      <div className="flexC gap2 borderB padYB3 fullWidth alignC">
        <h3 className="fS noWrap">Senior Frontend Engineer</h3>
        <div className="color2 borderM bR6 bg2 padX2 padY1 flex gap1 fitW">Overall Score <span className="colorM">7.4/10</span> </div>
      </div>

      <div className="question-list flexC gap2">

        <div className="question-item active">
          <div>
            <div className="flex gap1">Q1 <div className="questionStatusIcon"><Check color="aqua"/></div></div>
            <div className="">8/10</div>
          </div>
        </div>

        <div className="question-item">
          <div>Q2</div>
          <div>9/10</div>
        </div>

      </div>
    </div>
  );
};
