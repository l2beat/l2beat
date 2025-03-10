import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { ProjectDaThroughputChart } from '~/components/chart/data-availability/project-da-throughput-chart'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/chart-stats'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { ClockIcon } from '~/icons/clock'
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
  syncStatus: {
    warning: string | undefined
    isSynced: boolean
  }
  milestones: Milestone[]
}

export function ThroughputSection({
  projectId,
  throughput,
  pastDayAvgCapacityUtilization,
  pastDayAvgThroughputPerSecond,
  largestPoster,
  totalPosted,
  syncStatus,
  milestones,
  ...sectionProps
}: ThroughputSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {syncStatus.warning && (
        <div className="my-3.5 flex items-start gap-3 rounded-lg bg-surface-secondary p-4">
          <ClockIcon className="mt-px size-[18px] shrink-0" />
          <span className="text-sm font-medium text-primary">
            {syncStatus.warning}
          </span>
        </div>
      )}
      <p className="text-base">
        The chart shows the actual size of data posted to the DA Layer per day
        for the selected time period, as well as the maximum possible throughput
        per day.
      </p>
      <HorizontalSeparator className="my-4" />
      <ProjectDaThroughputChart
        projectId={projectId}
        configuredThroughputs={throughput}
        milestones={milestones}
      />
      <HorizontalSeparator className="my-4" />
      <ChartStats>
        <ChartStatsItem
          label="Past day avg. throughput"
          isSynced={syncStatus.isSynced}
        >
          {formatBpsToMbps(pastDayAvgThroughputPerSecond)}
        </ChartStatsItem>
        <ChartStatsItem
          label="Past day avg. capacity used"
          isSynced={syncStatus.isSynced}
        >
          {`${pastDayAvgCapacityUtilization}%`}
        </ChartStatsItem>
        <ChartStatsItem
          label="Past day largest poster"
          isSynced={syncStatus.isSynced}
        >
          {largestPoster
            ? `${largestPoster.name} (${largestPoster.percentage}%)`
            : undefined}
        </ChartStatsItem>
        <ChartStatsItem
          label="Past day total data posted"
          isSynced={syncStatus.isSynced}
        >
          {formatBytes(totalPosted)}
        </ChartStatsItem>
      </ChartStats>
    </ProjectSection>
  )
}
