import type { UnixTime } from '@l2beat/shared-pure'
import type { EcosystemMonthlyUpdateEntry } from '~/server/features/monthly-reports/getEcosystemEntries'
import { MonthlyUpdateActivityChart } from '../charts/MonthlyUpdateActivityChart'
import { MonthlyUpdateTvsChart } from '../charts/MonthlyUpdateTvsChart'
import { Leaderboards } from '../Leaderboards'
import { NewProjects } from '../NewProjects'
import { News } from '../News'
import { ProjectUpdateSection } from '../ProjectUpdateSection'

interface Props {
  ecosystem: EcosystemMonthlyUpdateEntry
  from: UnixTime
  to: UnixTime
}

export function EcosystemUpdateSection({ ecosystem, from, to }: Props) {
  return (
    <ProjectUpdateSection
      id={ecosystem.id}
      colors={ecosystem.colors}
      bannerImg={ecosystem.bannerImg}
    >
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <MonthlyUpdateTvsChart
          type="ecosystem"
          entries={ecosystem.projects}
          allScalingProjectsTvs={ecosystem.allScalingProjects.tvs}
          from={from}
          to={to}
        />
        <MonthlyUpdateActivityChart
          entries={ecosystem.projects}
          allScalingProjectsUops={ecosystem.allScalingProjects.uops}
          from={from}
          to={to}
        />
      </div>
      <Leaderboards
        tvsLeaderboard={ecosystem.tvsLeaderboard}
        activityLeaderboard={ecosystem.activityLeaderboard}
      />
      {ecosystem.newProjects.length > 0 && (
        <NewProjects newProjects={ecosystem.newProjects} />
      )}
      {ecosystem.news && ecosystem.news?.length > 0 && (
        <News news={ecosystem.news} />
      )}
    </ProjectUpdateSection>
  )
}
