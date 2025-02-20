import type { DaLayerThroughput } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { ProjectDaThroughputChart } from '~/components/chart/data-availability/project-da-throughput-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { cn } from '~/utils/cn'
import {
  formatBpsToMbps,
  formatBytes,
} from '~/utils/number-format/format-bytes'
import { ProjectSection } from '../project-section'
import type { ProjectSectionProps } from '../types'

export interface ThroughputSectionProps extends ProjectSectionProps {
  projectId: ProjectId
  throughput: DaLayerThroughput[]
  pastDayAvgCapacityUtilization: number
  pastDayAvgThroughputPerSecond: number
  largestPoster:
    | {
        name: string
        percentage: number
      }
    | undefined
  totalPosted: number
}

export function ThroughputSection({
  projectId,
  throughput,
  pastDayAvgCapacityUtilization,
  pastDayAvgThroughputPerSecond,
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
      <HorizontalSeparator className="my-4" />
      <ProjectDaThroughputChart
        projectId={projectId}
        configuredThroughputs={throughput}
      />
      <HorizontalSeparator className="my-4" />
      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-4',
          '-mx-4 mt-5 bg-surface-secondary p-4 md:mx-0 md:rounded-lg md:p-6',
        )}
      >
        <Detail
          label="Past day avg. throughput"
          value={formatBpsToMbps(pastDayAvgThroughputPerSecond)}
        />
        <Detail
          label="Past day avg. capacity used"
          value={`${pastDayAvgCapacityUtilization}%`}
        />
        <Detail
          label="Past day largest poster"
          value={
            largestPoster
              ? `${largestPoster.name} (${largestPoster.percentage}%)`
              : undefined
          }
        />
        <Detail
          label="Past day total data posted"
          value={formatBytes(totalPosted)}
        />
      </div>
    </ProjectSection>
  )
}

function Detail({
  label,
  value,
}: { label: string; value: string | undefined }) {
  return (
    <div className="flex items-center justify-between gap-2 md:flex-col md:items-start">
      <span className="whitespace-nowrap text-xs font-medium text-secondary">
        {label}
      </span>
      {value ? (
        <span className="text-lg font-medium text-primary md:font-bold">
          {value}
        </span>
      ) : (
        <NoDataBadge />
      )}
    </div>
  )
}
