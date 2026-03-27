import { useState } from "react";

export const CodingAnswerPanel= ({answerDraft, setAnswerDraft}:{answerDraft:any, setAnswerDraft:any}) => {
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("")
  return (
    <div className="answer-panel">
      <textarea
        value={code}
        onChange={e => {
          const value = e.target.value
          setCode(value)
          setAnswerDraft({
            response:value,
            language: selectedLanguage,
            skipped:false
          })
        }}
        placeholder="Write your code here..."
      />
    </div>
  );
};