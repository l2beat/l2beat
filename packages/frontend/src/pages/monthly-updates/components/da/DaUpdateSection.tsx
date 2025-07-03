import type { UnixTime } from '@l2beat/shared-pure'
import type { DaMonthlyUpdateEntry } from '~/server/features/monthly-reports/getDaEntries'
import { News } from '../News'
import { MonthlyUpdateThroughputChart } from '../charts/MonthlyUpdateThroughputChart'
import { MonthlyUpdateTvsChart } from '../charts/MonthlyUpdateTvsChart'

interface Props {
  daLayer: DaMonthlyUpdateEntry
  from: UnixTime
  to: UnixTime
}

export function DaUpdateSection({ daLayer, from, to }: Props) {
  return (
    <div
      id={daLayer.name}
      className="mt-12"
      style={
        {
          '--project-primary': daLayer.colors.primary,
          '--project-secondary': daLayer.colors.secondary,
        } as React.CSSProperties
      }
    >
      <img
        src={`/images/monthly-updates/${daLayer.daLayerId}.png`}
        className="mb-8 min-h-[60px] w-full rounded-lg object-cover"
      />
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <MonthlyUpdateTvsChart
          name={daLayer.name}
          entries={daLayer.daProjects}
          allScalingProjectsTvs={daLayer.allProjects.tvs}
          from={from}
          to={to}
        />
        <MonthlyUpdateThroughputChart
          name={daLayer.name}
          daLayer={daLayer.daLayerId}
          dataPosted={daLayer.allProjects.dataPosted}
          pastDayPosted={daLayer.pastDayPosted}
          from={from}
          to={to}
        />
      </div>
      {daLayer.news && daLayer.news?.length > 0 && <News news={daLayer.news} />}
    </div>
  )
}
