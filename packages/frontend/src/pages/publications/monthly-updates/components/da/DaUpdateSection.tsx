import type { UnixTime } from '@l2beat/shared-pure'
import type { DaMonthlyUpdateEntry } from '~/server/features/monthly-reports/getDaEntries'
import { MonthlyUpdateThroughputChart } from '../charts/MonthlyUpdateThroughputChart'
import { MonthlyUpdateTvsChart } from '../charts/MonthlyUpdateTvsChart'
import { NewProjects } from '../NewProjects'
import { News } from '../News'
import { ProjectUpdateSection } from '../ProjectUpdateSection'

interface Props {
  daLayer: DaMonthlyUpdateEntry
  from: UnixTime
  to: UnixTime
}

export function DaUpdateSection({ daLayer, from, to }: Props) {
  return (
    <ProjectUpdateSection
      id={daLayer.id}
      colors={daLayer.colors}
      bannerImg={daLayer.bannerImg}
    >
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <MonthlyUpdateTvsChart
          type="daLayer"
          entries={daLayer.daProjects}
          allScalingProjectsTvs={daLayer.allProjects.tvs}
          from={from}
          to={to}
        />
        <MonthlyUpdateThroughputChart
          id={daLayer.daLayerId}
          dataPosted={daLayer.allProjects.dataPosted}
          pastDayPosted={daLayer.pastDayPosted}
          from={from}
          to={to}
        />
      </div>
      {daLayer.newProjects.length > 0 && (
        <NewProjects newProjects={daLayer.newProjects} />
      )}
      {daLayer.news && daLayer.news?.length > 0 && <News news={daLayer.news} />}
    </ProjectUpdateSection>
  )
}
