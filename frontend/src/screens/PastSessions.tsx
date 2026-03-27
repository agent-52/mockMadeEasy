
import { Filter } from "lucide-react"
import { SessionCard } from "../components/SessionCard"
import "../styles/pastSession.css"
import { useState } from "react"

export const PastSessionsPage: React.FC = () => {
  const [query, setQuery] = useState("")
  const sessions = [
    {
      id: "1",
      role: "Frontend",
      stack: "React",
      difficulty: "Medium",
      mode: "Mixed",
      score: 7.8,
      duration: 32,
      topics: ["Hooks", "Performance", "Context"],
      date: "3 days ago",
      performance: "Strong"
    },
    {
      id: "2",
      role: "Backend",
      stack: "Node",
      difficulty: "Hard",
      mode: "Theory",
      score: 6.2,
      duration: 28,
      topics: ["JWT", "Scaling", "DB Design"],
      date: "1 week ago",
      performance: "Moderate"
    }
  ]

  function handleChange(event: { target: { value: any } }){
    const value = event.target.value;
    setQuery(value)
  }

  return (
    <div className="past-page container flexC gap4">

      {/* Header */}
      <div className="flex justifyB alignC padY4">
        <div>
          <h1 className="fL">Past Sessions</h1>
          <p className="color2 fS">
            Review and analyze your previous interview performances.
          </p>
        </div>

        <div className="flex gap2">
          <div className="icon-container1 flex borderM bg3 alignC justifyC bR6"><Filter color="#898989" size={20}/></div>
          <select name="filter" id="filter" className="bg2">
            <option value="Newest First">Newest First</option>
            <option value="Oldest First">Oldest First</option>
            <option value="Hight to Low">Score: High to Low</option>
            <option value="Low to High">Score: Low to High</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar flex justifyB padYB3 borderB">
        <div className="flexWrap gap3">
          <select name="role" id="role" className="bg2">
            <option value="All Roles">All Roles</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Fullstack</option>
            <option value="Dsa">Dsa</option>
          </select>
          <select name="stack" id="stack" className="bg2">
            <option value="All Stacks">All Stacks</option>
            <option value="React">React</option>
            <option value="Node">Node js</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="Angular">Angular</option>
          </select>
          <select name="difficulty" id="difficulty" className="bg2">
            <option value="All Levels">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select name="interviewType" id="interviewType" className="bg2">
            <option value="All types">All Modes</option>
            <option value="Theory">Theory</option>
            <option value="Coding">Coding</option>
            <option value="Mixed">Mixed</option>
          </select>
          <select name="time" id="time" className="bg2">
            <option value="All Time">All Time</option>
            <option value="7Days">Last 7 Days</option>
            <option value="30Days">Last 30 Days</option>
            <option value="90Days">Last 90 Days</option>
          </select>
        </div>
        <div className="pastSearchWrapper">
          <input
            type="text"
            id="header-search"
            placeholder="Search..."
            name="s"
            value={query}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      {/* Sessions */}
      <div className="flexC gap4">
        {sessions.map(session => (
          <SessionCard key={session.id} session={session}/>
        ))}
      </div>

    </div>
  )
}
