import type { UnixTime } from '@l2beat/shared-pure'
import type { EcosystemMonthlyUpdateEntry } from '../utils/getEcosystemEntries'
import { MonthlyUpdateActivityChart } from './MonthlyUpdateActivityChart'
import { MonthlyUpdateTvsChart } from './MonthlyUpdateTvsChart'
import { News } from './News'

interface Props {
  ecosystem: EcosystemMonthlyUpdateEntry
  from: UnixTime
  to: UnixTime
}

export function EcosystemUpdateSection({ ecosystem, from, to }: Props) {
  return (
    <div
      style={
        {
          '--ecosystem-primary': ecosystem.colors.primary,
          '--ecosystem-secondary': ecosystem.colors.secondary,
        } as React.CSSProperties
      }
    >
      <img
        src={`/images/monthly-updates/${ecosystem.ecosystemId}.png`}
        className="mb-8 min-h-[60px] w-full object-cover"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
      {ecosystem.news && ecosystem.news?.length > 0 && (
        <News news={ecosystem.news} />
      )}
    </div>
  )
}
