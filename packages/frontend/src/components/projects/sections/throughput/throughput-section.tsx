import type { DaLayerThroughput } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { ProjectDaThroughputChart } from '~/components/chart/data-availability/project-da-throughput-chart'
import { ProjectSection } from '../project-section'
import type { ProjectSectionProps } from '../types'

export interface ThroughputSectionProps extends ProjectSectionProps {
  projectId: ProjectId
  throughput: DaLayerThroughput[]
  pastDayAvgCapacityUtilization: string
  pastDayAvgThroughput: string
  largestPoster: string | undefined
  totalPosted: string
}

export function ThroughputSection({
  projectId,
  throughput,
  pastDayAvgCapacityUtilization,
  pastDayAvgThroughput,
  largestPoster,
  totalPosted,
  ...sectionProps
}: ThroughputSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-base">
        The chart shows the actual size of data posted to the DA Layer per day
        for the selected time period, as well as the maximum possible throughput
        per day.
      </p>
      <ProjectDaThroughputChart projectId={projectId} throughput={throughput} />
      <div className="grid grid-cols-1 gap-4 rounded-lg bg-surface-secondary p-6 sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="Past day avg. throughput" value={pastDayAvgThroughput} />
        <Detail
          label="Past day avg. capacity used"
          value={pastDayAvgCapacityUtilization}
        />
        <Detail label="Past day largest poster" value={largestPoster} />
        <Detail label="Past day total data posted" value={totalPosted} />
      </div>
    </ProjectSection>
  )
}

function Detail({
  label,
  value,
}: { label: string; value: string | undefined }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-xs font-medium text-secondary">{label}</span>
      {value ? (
        <span className="text-lg font-bold text-primary">{value}</span>
      ) : (
        <NoDataBadge />
      )}
    </div>
  )
}
