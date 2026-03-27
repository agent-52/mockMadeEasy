import { PrimaryActionCard } from "../components/Dashboard/PrimaryActionCard";
import { StatsOverview } from "../components/Dashboard/StatsOverview";
import { RecommendedPractice } from "../components/Dashboard/RecommendedPractice";
import { RecentSessions } from "../components/Dashboard/RecentSessions";
import { PracticeConsistency } from "../components/Dashboard/PracticeConsistency";
import { QuickActions } from "../components/Dashboard/QuickActions";
import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "../api/interview.api";



export function Dashboard() {

  const {data,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => getDashboardOverview(),
    staleTime: 1000 * 60 * 5
  })

  if (isLoading) {
    return <div>Generating your Dashboard report...</div>
  }
  if (isError) {
    return <div>Failed to load Dashboard details </div>
  }
  if(!data){
    return <div>No details found</div>
  }


  return (
    <div className="dashboard flexC gap5">
      <PrimaryActionCard primaryAction={data.primaryAction}/>
      <StatsOverview statsOverview={data.statsOverview}/>
      <RecommendedPractice recommendations={data.recommendedPractice}/>
      <RecentSessions sessions={data.recentSessions} />
      <PracticeConsistency practiceConsistency={data.practiceConsistency} />
      <QuickActions />
    </div>
  );
}
