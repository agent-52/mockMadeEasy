import { useEffect, useState, type CSSProperties } from "react";

const VOICE_HEIGHTS = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.65, 0.45, 0.75];

export function WideInterviewMockup() {
  const [voiceActive, setVoiceActive] = useState(true);
  const [seconds, setSeconds] = useState(847);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="card-window-lg">
      <div className="window-chrome-lg">
        <div className="window-dots-lg">
          {[0, 1, 2].map((i) => (
            <div key={i} className="window-dot-lg" />
          ))}
        </div>
        <div className="window-url-wrap">
          <div className="window-url-bar">
            <span className="window-url-text">
              app.mockmadeeasy.com/interview/session
            </span>
          </div>
        </div>
        <div className="window-timer">
          <div className="window-timer-dot" />
          <span className="window-timer-text">{fmt(seconds)}</span>
        </div>
      </div>

      <div className="mockup-body">
        {/* Sidebar */}
        <div className="mockup-sidebar">
          <p className="sidebar-section-label">Session</p>
          {[
            {
              label: "Frontend Engineer",
              active: true,
              sub: "Mid-Level · 8 Qs",
            },
            { label: "Topics", active: false, sub: "React, TypeScript" },
            { label: "Progress", active: false, sub: "4 of 8 complete" },
          ].map(({ label, active, sub }) => (
            <div
              key={label}
              className={active ? "session-item active" : "session-item"}
            >
              <p className="session-item-name">{label}</p>
              <p className="session-item-sub">{sub}</p>
            </div>
          ))}
          <div className="score-section">
            <p className="sidebar-section-label">Score</p>
            {(
              [
                ["Technical", 88],
                ["Communication", 74],
                ["Confidence", 69],
              ] as [string, number][]
            ).map(([k, v]) => (
              <div key={k} className="score-row">
                <div className="score-row-top">
                  <span className="score-key">{k}</span>
                  <span className="score-val">{v}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ "--w": `${v}%` } as CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="mockup-chat">
          <div className="chat-messages">
            <div className="chat-row">
              <div className="chat-avatar">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9C9C9"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                </svg>
              </div>
              <div className="chat-bubble-ai">
                <p className="chat-text-ai">
                  Can you explain the difference between{" "}
                  <code className="code-tag">useEffect</code> and{" "}
                  <code className="code-tag">useLayoutEffect</code>? When would
                  you prefer one over the other?
                </p>
              </div>
            </div>
            <div className="chat-row-user">
              <div className="chat-bubble-user">
                <p className="chat-text-user">
                  useEffect runs asynchronously after the browser paints.
                  useLayoutEffect fires synchronously before the paint — useful
                  when you need to measure the DOM...
                </p>
              </div>
              <div className="chat-avatar">
                <span className="chat-avatar-text">ME</span>
              </div>
            </div>
            <div className="chat-row">
              <div className="chat-avatar">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9C9C9"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                </svg>
              </div>
              <div className="chat-bubble-ai">
                <p className="chat-text-ai">
                  Good. Can you give me a specific example where using{" "}
                  <code className="code-tag">useEffect</code> instead would
                  cause a flicker?
                </p>
              </div>
            </div>
          </div>
          <div className="chat-input-row">
            <button
              onClick={() => setVoiceActive((v: any) => !v)}
              className={voiceActive ? "voice-btn active" : "voice-btn"}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={voiceActive ? "#000" : "#6B6B6B"}
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              </svg>
            </button>
            {voiceActive ? (
              <div className="voice-bars">
                {VOICE_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className="voice-bar"
                    style={
                      {
                        "--h": `${h * 18}px`,
                        "--dur": `${0.5 + i * 0.07}s`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-input-box">
                <span className="text-placeholder">Type your answer…</span>
              </div>
            )}
            <button className="submit-btn">Submit</button>
          </div>
        </div>

        {/* Feedback */}
        <div className="mockup-feedback">
          <p className="feedback-panel-label">AI Feedback</p>
          <div className="feedback-card">
            <div className="feedback-header">
              <div className="feedback-dot feedback-dot-success" />
              <span className="feedback-label-success">Strong start</span>
            </div>
            <p className="feedback-body">
              You correctly identified the timing difference. Consider adding a
              concrete DOM measurement example.
            </p>
          </div>
          <div className="feedback-card">
            <div className="feedback-header">
              <div className="feedback-dot feedback-dot-warning" />
              <span className="feedback-label-warning">Missing detail</span>
            </div>
            <p className="feedback-body">
              Didn&apos;t mention async vs sync nature and its impact on paint
              performance.
            </p>
          </div>
          <div className="question-progress-card">
            <p className="question-progress-label">Question 4 of 8</p>
            <div className="progress-segments">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className={
                    n < 4
                      ? "progress-seg done"
                      : n === 4
                        ? "progress-seg current"
                        : "progress-seg"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
