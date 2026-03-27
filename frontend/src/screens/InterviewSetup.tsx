import React, { useEffect, useState } from "react";
import "../interviewSetup.css";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router";
import {
  getSubjects,
  getTopicBySubject,
  previewInterview,
  type PreviewPayload,
} from "../api/interview.api";

/* =========================
   TYPES
========================= */

type InterviewType = "frontend" | "backend" | "fullstack" | "dsa";
type Difficulty = "easy" | "medium" | "hard";

type Subject = {
  id: number;
  title: string;
  category: "frontend" | "backend" | "database" | "dsa";
};

type Topic = {
  id: number;
  name: string;
};

/* =========================
   INTERVIEW SETUP
========================= */

export const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();

  const [interviewType, setInterviewType] = useState<InterviewType | null>(
    null
  );

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);

  const [topicsExpanded, setTopicsExpanded] = useState(false);

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [questionCount, setQuestionCount] = useState<number>(8);

  const [includeIntro, setIncludeIntro] = useState(false);
  const [includeDSA, setIncludeDSA] = useState(false);

  /* =========================
     LOAD SUBJECTS
  ========================= */

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadSubjects();
  }, []);

  /* =========================
     LOAD TOPICS
  ========================= */

  useEffect(() => {
    async function loadTopics() {
      if (selectedSubjects.length === 0) {
        setTopics([]);
        return;
      }

      let allTopics: Topic[] = [];

      for (const subjectId of selectedSubjects) {
        const subjectTopics = await getTopicBySubject(subjectId);
        allTopics = [...allTopics, ...subjectTopics];
      }

      setTopics(allTopics);
    }

    loadTopics();
  }, [selectedSubjects, subjects]);

  /* =========================
     INCLUDE DSA
  ========================= */

  useEffect(() => {
    if (!includeDSA) return;

    const dsaSubject = subjects.find((s) => s.category === "dsa");

    if (dsaSubject && !selectedSubjects.includes(dsaSubject.id)) {
      setSelectedSubjects((prev) => [...prev, dsaSubject.id]);
    }
  }, [includeDSA, subjects]);

  /* =========================
     HELPERS
  ========================= */
  
  function resetBelowType(type: InterviewType) {
    setInterviewType(type);
    setSelectedSubjects([]);
    setSelectedTopics([]);
    setTopics([]);
    setTopicsExpanded(false);
  }

  function toggleTopic(topicId: number) {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  }

  function selectSubject(subjectId: number) {
    setSelectedSubjects([subjectId]);
    setSelectedTopics([]);
  }

  function canStart() {
    return selectedSubjects.length > 0;
  }

  /* =========================
     PREVIEW INTERVIEW
  ========================= */

  async function handlePreview() {
    if (!canStart()) return;

    const subjectNames = selectedSubjects
    .map((id) => subjects.find((s) => s.id === id)?.title)
    .filter(Boolean) as string[];

    const payload: PreviewPayload = {
      roleType: interviewType,
      subjects: subjectNames,
      topicIds: selectedTopics,
      difficulty,
      questionCount,
      includeIntro,
    };

    try {
      const preview = await previewInterview(payload);
      navigate("/interview/confirmation", {
        state: {
          preview,
          payload,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================
     SUBJECT FILTERS
  ========================= */

  const frontendSubjects = subjects.filter(
    (s) => s.category === "frontend"
  );

  const backendSubjects = subjects.filter(
    (s) => s.category === "backend"
  );

  const databaseSubjects = subjects.filter(
    (s) => s.category === "database"
  );

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="interview-setup container bg3 border flexC">

      {/* Header */}
      <section className="borderB padY3">
        <h2 className="fM">Set up your interview</h2>
        <p className="textSecondary fS">
          Choose your role and stack to simulate a real interview.
        </p>
      </section>

      {/* Interview Type */}
      <section className="borderB2 padY2 selectWrapper">
        <h3 className="fM noWrap">Interview type</h3>

        <select
          className="bg4"
          value={interviewType ?? ""}
          onChange={(e) =>
            resetBelowType(e.target.value as InterviewType)
          }
        >
          <option value="">Select type</option>
          <option value="frontend">frontend</option>
          <option value="backend">backend</option>
          <option value="fullstack">fullstack</option>
          <option value="dsa">dsa</option>
        </select>
      </section>

      {/* FRONTEND */}
      {interviewType === "frontend" && (
        <section className="borderB2 padY2 selectWrapper">
          <h3>Frontend stack</h3>

          <select
            className="bg4"
            value={selectedSubjects[0] || ""}
            onChange={(e) => selectSubject(Number(e.target.value))}
          >
            <option value="">Select stack</option>

            {frontendSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </section>
      )}

      {/* BACKEND */}
      {interviewType === "backend" && (
        <section className="borderB2 padY2 selectWrapper">
          <h3>Backend stack</h3>

          <select
            className="bg4"
            value={selectedSubjects[0] || ""}
            onChange={(e) => selectSubject(Number(e.target.value))}
          >
            <option value="">Select stack</option>

            {backendSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </section>
      )}

      {/* FULLSTACK */}
      {interviewType === "fullstack" && (
        <>
          <section className="borderB2 padY2 selectWrapper">
            <h3>Frontend stack</h3>

            <select
              className="bg4"
              onChange={(e) =>
                setSelectedSubjects((prev) => [
                  Number(e.target.value),
                  ...prev.filter(
                    (id) =>
                      !frontendSubjects.find((s) => s.id === id)
                  ),
                ])
              }
            >
              <option value="">Select stack</option>

              {frontendSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </section>

          <section className="borderB2 padY2 selectWrapper">
            <h3>Backend stack</h3>

            <select
              className="bg4"
              onChange={(e) =>
                setSelectedSubjects((prev) => [
                  Number(e.target.value),
                  ...prev.filter(
                    (id) =>
                      !backendSubjects.find((s) => s.id === id)
                  ),
                ])
              }
            >
              <option value="">Select stack</option>

              {backendSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </section>

          <section className="borderB2 padY2 selectWrapper">
            <h3>Database</h3>

            <select
              className="bg4"
              onChange={(e) =>
                setSelectedSubjects((prev) => [
                  Number(e.target.value),
                  ...prev.filter(
                    (id) =>
                      !databaseSubjects.find((s) => s.id === id)
                  ),
                ])
              }
            >
              <option value="">Select database</option>

              {databaseSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </section>
        </>
      )}

      {/* Difficulty */}
      <section className="borderB2 padY2 selectWrapper">
        <h3>Difficulty</h3>

        <select
          className="bg4"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as Difficulty)
          }
        >
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </section>

      {/* QUESTION COUNT */}
      <div>
        <label htmlFor="questionCount">Number of questions</label>

        <input
          type="number"
          id="questionCount"
          value={questionCount}
          onChange={(e) =>
            setQuestionCount(Number(e.target.value))
          }
        />
      </div>

      {/* INTRO */}
      <div>
        <label>Include introduction questions</label>

        <input
          type="checkbox"
          checked={includeIntro}
          onChange={(e) =>
            setIncludeIntro(e.target.checked)
          }
        />
      </div>

      {/* DSA */}
      <div>
        <label>Include DSA questions</label>

        <input
          type="checkbox"
          checked={includeDSA}
          onChange={(e) =>
            setIncludeDSA(e.target.checked)
          }
        />
      </div>

      {/* TOPICS */}
      {topics.length > 0 && (
        <section className="flexC gap2 borderB2 padY2">

          <div
            className="btn-link color2 pointer flex alignC"
            onClick={() =>
              setTopicsExpanded((prev) => !prev)
            }
          >
            Select specific topics (optional)

            {topicsExpanded ? (
              <ChevronDown color="#898989" size={20} />
            ) : (
              <ChevronRight color="#898989" size={20} />
            )}
          </div>

          {topicsExpanded && (
            <div className="flex wrap gap2">

              {topics.map((topic) => (
                <Button
                  key={topic.id}
                  text={topic.name}
                  onClickFn={() =>
                    toggleTopic(topic.id)
                  }
                  className={`btn-secondary ${
                    selectedTopics.includes(topic.id)
                      ? "active"
                      : ""
                  }`}
                  paddingX={10}
                  paddingY={5}
                  disabled={false}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <section className="padY2 flex gap2 justifyE">
        <Link to="/dashboard">
          <Button
            text="Cancel"
            paddingX={10}
            paddingY={5}
            onClickFn={() => {}}
            className="btn-tertiary bg4"
            disabled={false}
          />
        </Link>

        <button
          className="btn-primary"
          style={{ paddingInline: 10, paddingBlock: 3 }}
          disabled={!canStart()}
          onClick={handlePreview}
        >
          Start interview
        </button>
      </section>
    </div>
  );
};