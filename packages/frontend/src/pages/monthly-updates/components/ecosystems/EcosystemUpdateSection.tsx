import type { UnixTime } from '@l2beat/shared-pure'
import type { EcosystemMonthlyUpdateEntry } from '~/server/features/monthly-reports/getEcosystemEntries'
import { Leaderboards } from '../Leaderboards'
import { MonthlyUpdateActivityChart } from '../MonthlyUpdateActivityChart'
import { MonthlyUpdateTvsChart } from '../MonthlyUpdateTvsChart'
import { NewProjectsSection } from '../NewProjectsSection'
import { News } from '../News'

interface Props {
  ecosystem: EcosystemMonthlyUpdateEntry
  from: UnixTime
  to: UnixTime
}

export function EcosystemUpdateSection({ ecosystem, from, to }: Props) {
  return (
    <div
      id={ecosystem.name}
      className="mt-12"
      style={
        {
          '--ecosystem-primary': ecosystem.colors.primary,
          '--ecosystem-secondary': ecosystem.colors.secondary,
        } as React.CSSProperties
      }
    >
      <img
        src={`/images/monthly-updates/${ecosystem.ecosystemId}.png`}
        className="mb-8 min-h-[60px] w-full rounded-lg object-cover"
      />
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <MonthlyUpdateTvsChart
          name={ecosystem.name}
          entries={ecosystem.projects}
          allScalingProjectsTvs={ecosystem.allScalingProjects.tvs}
          from={from}
          to={to}
        />
        <MonthlyUpdateActivityChart
          name={ecosystem.name}
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
        <NewProjectsSection newProjects={ecosystem.newProjects} />
      )}
      {ecosystem.news && ecosystem.news?.length > 0 && (
        <News news={ecosystem.news} />
      )}
    </div>
  )
}
