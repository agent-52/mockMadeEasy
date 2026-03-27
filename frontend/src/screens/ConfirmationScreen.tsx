import React, { Activity } from "react"
import { Clock, Hash, Layers, Code2, ArrowLeft, Edit, Edit2, Edit3, type LucideIcon, Code, Settings, Zap, ActivityIcon, AlertCircle } from "lucide-react"
import "../styles/confirmationScreen.css"
import { ButtonWithImage } from '../components/Button';
import { Link, useLocation, useNavigate } from "react-router";
import type { CreationPayload, PreviewPayload } from "../api/interview.api";
import { createInterview as createInterviewAPI } from "../api/interview.api";

export const ConfirmationScreen: React.FC = () => {
  const navigate = useNavigate()
  const {state} = useLocation()
  const payload:PreviewPayload = state.payload
  const preview = state.preview
  function handleEdit(){

  }

  async function handleCreateInterview(){
    const creationPayload:CreationPayload = {
      ...payload,
      seed:preview.seed
    }
    
    const create = await createInterviewAPI(creationPayload)
    
    const interviewId = create.interviewId
    navigate(`/interview/session/${interviewId}`)
  }
  
  const config = {
    role: "Frontend",
    stack: "React",
    difficulty: "Medium",
    mode: "Mixed (Theory + Coding)",
    introQuestions: true,
    topics: [
      "React Hooks",
      "Performance Optimization",
      "Context API",
      "TypeScript",
      "Memoization"
    ],
    structure: {
      total: 8,
      theory: 5,
      coding: 3,
      duration: "30–40 minutes",
      perQuestion: "3–5 minutes"
    }
  }

  if(!state){
    navigate("/interview/setup")
    return null
  }
  return (
    <div className="confirmation-page gap5 container flexC">

      {/* HEADER */}
      <div className="flex justifyB alignC">
        <div>
          <h1 className="fL">Review Interview Setup</h1>
          <p className="fS muted">
            Confirm your configuration before generating your AI interview session.
          </p>
        </div>

        <div className="flex gap4 reverse">
          <ButtonWithImage text="Edit Setup" className="btn3 flex  alignC justifyC" icon={<Edit3 size={16} />} paddingX={16} paddingY={1} disabled={false} onClickFn={handleEdit}/>
          <Link to="/interview/setup" className="color2 hoverEffect flex gap2 alignC">
            <ArrowLeft size={16}/> Back
          </Link>
        </div>
      </div>

      {/* main area */}
      <div className="confiramtion-main-wrapper flex gap5 fullWidth">
        <div className="fullWidth borderM pad1 bg2 bR6">
          {/* ROLE SUMMARY */}
          <div className="borderB bg2 pad4 flexC gap4">

            <div className="grid2 gap4">
              <ConfirmationItem label="Role Type" value={config.role} icon={<Code color="#898989" size={20}/>}/>
              <ConfirmationItem label="Stack" value={config.stack} icon={<Layers color="#898989" size={20}/>}/>
              <ConfirmationItem label="Difficulty" value={config.difficulty} icon={<Settings color="#898989" size={20}/>}/>
              <ConfirmationItem label="Mode" value={config.mode} icon={<Zap color="#898989" size={20}/>} />
            </div>

            <div className="flexC gap1">
              <div className="fXS color2">Intro Questions</div>
              {config.introQuestions ? (
                <div className="chip padX3 pad0 bR6 fS">Enabled</div>
              ):(<div>Disabled</div>)}
            </div>
            

          </div>

          {/* TOPICS */}
          <div className="bg2 borderB pad4 flexC gap3">
            <h3 className="fM">Selected Topics</h3>

            <div className="flex wrap gap2">
              {config.topics.map((topic, i) => (
                <span key={i} className="chip padX3 pad0 bR6 fS">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* STRUCTURE */}
          <div className="bg2 pad4 flexC gap4">
            <h3 className="fM">Interview Structure</h3>

            <div className="grid3 gap4">
              <StructureCard icon={<Hash size={18} color="#898989"/>} label="Total Questions" value={config.structure.total}/>
              <StructureCard icon={<Layers size={18} color="#898989"/>} label="Theory Questions" value={config.structure.theory}/>
              <StructureCard icon={<Code2 size={18} color="#898989"/>} label="Coding Questions" value={config.structure.coding}/>
            </div>

            <div className="grid2 gap4">
              <StructureCard icon={<Clock size={18} color="#898989"/>} label="Estimated Duration" value={config.structure.duration}/>
              <StructureCard icon={<Clock size={18} color="#898989"/>} label="Time Per Question" value={config.structure.perQuestion}/>
            </div>
          </div>
        </div>
        <div>
          {/* RIGHT COLUMN */}
          <div className="flexC gap4">
            <div className="noWrap bg2 bR6 borderM pad4 flexC gap4">
              <h3 className="fS color2">Session Summary</h3>
              <div className="flexC gap4">
                <ConfirmationItem label="Duration" value="30–40 minutes" icon={<Clock color="#898989" size={20}/>} />
                <ConfirmationItem label="Total Questions" value={config.structure.total.toString()} icon={<Hash color="#898989" size={20}/>} />

                <div className="difficulty-block gap1 flexC">
                  <ConfirmationItem label="Difficulty level" value=  {config.difficulty} icon={<ActivityIcon color="#898989" size={20}/>} />
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width:"60%"}}/>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-primary fullWidth padY3 fS" onClick={handleCreateInterview}>
              Generate Interview
            </button>

            <p className="muted fXS textCenter">
              Your session will be created instantly.
            </p>
          </div>

        </div>
      </div>

      {/* WARNING */}
      <div className="warning-box pad3 flex alignC gap1">
        <AlertCircle size={20}/>
        <span>Once started, the session cannot be modified.</span>
      </div>

      

      
    </div>
  )
}


const ConfirmationItem = ({label, value, icon}:{label:string,value:string, icon:React.ReactNode}) => (
  <div className="flex gap2">
    <div className="icon-container1 flex borderM bg3 alignC justifyC bR6">
      {icon}
    </div>
    <div className="flexC">
      <span className="color2 fXS">{label}</span>
      <span className="fM">{value}</span>
    </div>
    
  </div>
)

const StructureCard = ({icon,label,value}:{icon:React.ReactNode,label:string,value:any}) => (
  <div className="borderM bR6 bg3 pad3 flexC gap1">
    <div className="flex alignC">
      {icon}
    </div>
    <div className="flexC">
      <span className="fL">{value}</span>
      <span className="color2 fXS">{label}</span>
    </div>
  </div>
)

const SummaryRow = ({label,value}:{label:string,value:string}) => (
  <div className="flex justifyB">
    <span className="muted fS">{label}</span>
    <span className="fM">{value}</span>
  </div>
)
