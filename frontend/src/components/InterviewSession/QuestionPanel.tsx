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
  const isPlayingRef = useRef(false);
  const lastPlayedUrlRef = useRef<string | null>(null);

  function isSubmitDisabled() {
    if (!answerDraft.response.trim() || isSubmittingAnswer || isEvaluatingCode || isEvaluatingPhase) {
      return true;
    }
    return false;
  }

  async function playSingle(url: string) {
    const audio = audioRef.current;
    if (!audio || isCancelledRef.current) return;

    return new Promise<void>((resolve) => {
      try {
        audio.src = url;

        // 🔥 CRITICAL FIX → allow browser to register src
        setTimeout(() => {
          if (isCancelledRef.current) return resolve();

          const onEnd = () => {
            audio.removeEventListener("ended", onEnd);
            resolve();
          };

          const onError = () => {
            audio.removeEventListener("ended", onEnd);
            resolve();
          };

          audio.addEventListener("ended", onEnd, { once: true });

          audio.play().catch(() => resolve());
        }, 50);

      } catch {
        resolve();
      }
    });
  }

  async function startPlayback() {
    if (isPlayingRef.current) return;

    isPlayingRef.current = true;
    isCancelledRef.current = false;

    try {
      setIsSpeaking(true);

      // 🔥 play transition first (if exists)
      if (transition?.audioUrl && !isCancelledRef.current) {
        await playSingle(transition.audioUrl);
      }

      // 🔥 then main question
      if (currentQuestionAudioUrl && !isCancelledRef.current) {
        await playSingle(currentQuestionAudioUrl);
      }

    } finally {
      if (!isCancelledRef.current) {
        setIsSpeaking(false);
      }
      isPlayingRef.current = false;
    }
  }

  // ✅ FIXED EFFECT (no aggressive cleanup)
  useEffect(() => {
    if (!currentQuestionAudioUrl) return;

    // prevent duplicate playback
    if (lastPlayedUrlRef.current === currentQuestionAudioUrl) return;

    lastPlayedUrlRef.current = currentQuestionAudioUrl;

    isCancelledRef.current = false;

    startPlayback();

    return () => {
      // only mark cancelled (DON'T pause)
      isCancelledRef.current = true;
    };

  }, [currentQuestionAudioUrl]);

  return (
    <div className="question-panel flexC gap4 padX4 borderR">
      <audio ref={audioRef} preload="auto" />

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
              isPlayingRef.current = false;
              lastPlayedUrlRef.current = null;

              setTimeout(() => {
                startPlayback();
              }, 100);
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