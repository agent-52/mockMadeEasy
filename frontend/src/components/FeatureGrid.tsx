import "../componentStyles/featureGrid.css"
import {Target,Bot,Brain,BarChart3,TrendingUp,Focus,SquareChevronRight,Crosshair, Terminal, Cpu, GitBranch, SplitSquareVertical, Activity, TerminalSquare, Minimize2} from "lucide-react"
export function FeatureGrid() {
  const features = [
    {
      title: "Real interview questions",
      description:
        "Practice questions designed around real interview expectations, not random quizzes.",
      icon: <Target />,
      image:<Crosshair color="#898989"/>
    },
    {
      title:"In-built coding environment",
      description:
        "Solve coding questions in a built-in editor designed for real interview conditions, with evaluation focused on correctness and approach.",
        icon:<Terminal />,
        image:<TerminalSquare color="#898989"/>
    },
    {
      title: "AI-powered feedback",
      description:
        "Understand where your answer was unclear, incomplete, or off-track with clear AI feedback.",
      icon: <Bot />,
      image: <Cpu color="#898989"/>
    },
    {
      title: "Structured interview flow",
      description:
        "Experience interviews that follow a realistic flow, helping you think under pressure.",
      icon: <Brain />,
      image: <GitBranch color="#898989"/>
    },
    {
      title: "Answer review & comparison",
      description:
        "See your response alongside an ideal direction to identify gaps and strengths.",
      icon: <BarChart3 />,
      image: <SplitSquareVertical color="#898989"/>
    },
    {
      title: "Progress over time",
      description:
        "Track how your thinking improves across multiple interviews and topics.",
      icon: <TrendingUp />,
      image: <Activity color="#898989"/>
    },
    {
      title: "Focused environment",
      description:
        "A calm, distraction-free interface designed to help you think clearly.",
      icon: <Minimize2 />,
      image: <Focus color="#898989"/>
    }
  ];

  return (
    <section className="padY4">
      <div className="container flexC gap5">
        {/* <div className="flexC alignC gap3">
          <h2 className="fXL">How we help you improve</h2>
          <div className="fs color2">you are not bad at interviews, just underpractised</div>
          <button className="btn-secondary">Start now</button>
          
        </div> */}

        <div className="feature-grid padY3">
          {features.map((f, i) => (
            <div key={i} className="feature-card-grid">
              

              <div className="flex alignC gap2">
                <div className="feature-icon">{f.icon}</div>
                <div className="fM">{f.title}</div>
                
              </div>
              <p className="fS textSecondary">{f.description}</p>

              {/* Visual / image placeholder */}
              <div className="feature-visual flex alignC justifyC">
                <div className="icon-visual">
                  {f.image}
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
