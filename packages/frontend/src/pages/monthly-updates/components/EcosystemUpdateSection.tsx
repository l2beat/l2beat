import type { UnixTime } from '@l2beat/shared-pure'
import { CssVariables } from '~/components/CssVariables'
import type { EcosystemMonthlyUpdateEntry } from '../utils/getEcosystemEntries'
import { MonthlyUpdateTvsChart } from './MonthlyUpdateTvsChart'
import { News } from './News'

interface Props {
  ecosystem: EcosystemMonthlyUpdateEntry
  from: UnixTime
  to: UnixTime
}

export function EcosystemUpdateSection({ ecosystem, from, to }: Props) {
  return (
    <div>
      <CssVariables
        variables={{
          'ecosystem-primary': ecosystem.colors.primary,
          'ecosystem-primary-50': `${ecosystem.colors.primary}80`,
          'ecosystem-primary-25': `${ecosystem.colors.primary}40`,
          'ecosystem-secondary': ecosystem.colors.secondary,
          spacing: '0.75rem',
        }}
      />
      <img
        src={`/images/monthly-updates/${ecosystem.ecosystemId}.png`}
        className="mb-8 min-h-[60px] w-full object-cover"
      />
      <div className="grid grid-cols-2 gap-3">
        <MonthlyUpdateTvsChart
          name={ecosystem.name}
          entries={ecosystem.projects}
          allScalingProjectsTvs={ecosystem.allScalingProjects.tvs}
          from={from}
          to={to}
        />
        <MonthlyUpdateTvsChart
          name={ecosystem.name}
          entries={ecosystem.projects}
          allScalingProjectsTvs={ecosystem.allScalingProjects.tvs}
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
