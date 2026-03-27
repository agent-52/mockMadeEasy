import { useEffect, useRef, useState } from "react";
import type { Question } from "../../common/types";
import { BookCheck, ChevronRight, UserRound, Volume1 } from "lucide-react";
import { ButtonWithImage } from "../Button";
import { interviewStore } from "../../store/interview.store";

export const QuestionPanel: React.FC<{
question: Question;
handleSubmit: () => void;
interviewCompleted: boolean;
answerDraft: any;
setAnswerDraft: any;
}> = ({ question, handleSubmit, interviewCompleted, answerDraft }) => {

const [isSpeaking, setIsSpeaking] = useState(false);

const currentQuestionAudioUrl = interviewStore((s: any) => s.currentQuestionAudioUrl);
const transition = interviewStore((s: any) => s.transition);
const answeredCount = interviewStore((s: any) => s.answeredCount);
const isSubmittingAnswer = interviewStore((s: any) => s.isSubmittingAnswer);
const isEvaluatingPhase = interviewStore((s: any) => s.isEvaluatingPhase);
const isEvaluatingCode = interviewStore((s: any) => s.isEvaluatingCode);

const audioRef = useRef<HTMLAudioElement | null>(null);
const isCancelledRef = useRef(false);

function isSubmitDisabled() {
if (!answerDraft.response.trim() || isSubmittingAnswer || isEvaluatingCode || isEvaluatingPhase) {
return true;
}
return false;
}

async function playAudioSequence(urls: (string | null)[]) {
const audio = audioRef.current;
if (!audio) return;


isCancelledRef.current = false;

try {
  setIsSpeaking(true);

  for (const url of urls) {
    if (!url || isCancelledRef.current) break;

    await new Promise<void>((resolve) => {
      if (isCancelledRef.current) return resolve();

      audio.src = url;

      const onEnd = () => {
        audio.removeEventListener("ended", onEnd);
        resolve();
      };

      const onError = () => {
        audio.removeEventListener("ended", onEnd);
        resolve(); // prevent crash
      };

      audio.addEventListener("ended", onEnd, { once: true });

      audio.play().catch(() => resolve());
    });
  }

} catch (err) {
  console.error("audio error", err);
} finally {
  if (!isCancelledRef.current) {
    setIsSpeaking(false);
  }
}


}

useEffect(() => {
if (!currentQuestionAudioUrl) return;


playAudioSequence([
  transition?.audioUrl,
  currentQuestionAudioUrl
]);

return () => {
  isCancelledRef.current = true;

  const audio = audioRef.current;
  if (audio) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
};


}, [currentQuestionAudioUrl, transition?.audioUrl]);

return ( <div className="question-panel flexC gap4 padX4 borderR"> <audio ref={audioRef} />


  <div className="ai-image-video-wrapper bg2 flex alignC justifyC shadow">
    <div className="ai-image-video-container bg1 pad3 flex alignC justifyC border">
      <UserRound />
    </div>
  </div>

  <div className="flexC gap4 question-content-wrapper bg2 pad4 shadow">
    <div className="color4">Question {answeredCount + 1}</div>

    <div className="flexC gap1">
      <h3 className="fM">{question.title}</h3>
      <p className="color2 fS">{question.description}</p>
    </div>

    <div className="flex gap3">
      <ButtonWithImage
        className="btn-secondary flex gap1 alignC justifyC"
        text={isSpeaking ? "Speaking..." : "Relisten"}
        onClickFn={() => {
          if (isSpeaking) return;

          isCancelledRef.current = true;
          playAudioSequence([currentQuestionAudioUrl]);
        }}
        paddingX={16}
        paddingY={5}
        icon={<Volume1 />}
        disabled={isSpeaking}
      />

      {!interviewCompleted ? (
        <ButtonWithImage
          icon={<ChevronRight />}
          onClickFn={handleSubmit}
          text="Next Question"
          paddingX={16}
          paddingY={5}
          className="btn-secondary fullWidth flex gap1 alignC justifyC reverse"
          disabled={isSubmitDisabled()}
        />
      ) : (
        <ButtonWithImage
          icon={<BookCheck />}
          onClickFn={handleSubmit}
          text="Finish Interview"
          paddingX={16}
          paddingY={5}
          className="btn-primary fullWidth reverse flex gap1 alignC justifyC"
          disabled={isSubmitDisabled()}
        />
      )}
    </div>
  </div>
</div>


);
};
