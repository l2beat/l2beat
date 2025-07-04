import type { UnixTime } from '@l2beat/shared-pure'
import type { DaMonthlyUpdateEntry } from '~/server/features/monthly-reports/getDaEntries'
import { NewProjectsSection } from '../NewProjectsSection'
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
      className="mb-8 md:mb-16"
      style={
        {
          '--project-primary': daLayer.colors.primary,
          '--project-secondary': daLayer.colors.secondary,
        } as React.CSSProperties
      }
    >
      <img
        src={daLayer.bannerImg}
        className="mb-4 min-h-[70px] w-full rounded-lg object-cover md:mb-8"
      />
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <MonthlyUpdateTvsChart
          type="daLayer"
          entries={daLayer.daProjects}
          allScalingProjectsTvs={daLayer.allProjects.tvs}
          from={from}
          to={to}
        />
        <MonthlyUpdateThroughputChart
          daLayer={daLayer.daLayerId}
          dataPosted={daLayer.allProjects.dataPosted}
          pastDayPosted={daLayer.pastDayPosted}
          from={from}
          to={to}
        />
      </div>
      {daLayer.newProjects.length > 0 && (
        <NewProjectsSection newProjects={daLayer.newProjects} />
      )}
      {daLayer.news && daLayer.news?.length > 0 && <News news={daLayer.news} />}
    </div>
  )
}
