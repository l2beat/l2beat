import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { ThroughputSectionChart } from '~/components/chart/data-availability/ThroughputSectionChart'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ClockIcon } from '~/icons/Clock'
import { formatBpsToMbps, formatBytes } from '~/utils/number-format/formatBytes'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface ThroughputSectionProps extends ProjectSectionProps {
  projectId: ProjectId
  throughput: DaLayerThroughput[]
  pastDayAvgCapacityUtilization: number | undefined
  pastDayAvgThroughputPerSecond: number | undefined
  largestPoster:
    | {
        name: string
        percentage: number
        totalPosted: number
        href: string
      }
    | undefined
  totalPosted: number | undefined
  customColors: Record<string, string>
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
  customColors,
  syncStatus,
  milestones,
  ...sectionProps
}: ThroughputSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {syncStatus.warning && (
        <div className="my-3.5 flex items-start gap-3 rounded-lg bg-surface-secondary p-4">
          <ClockIcon className="mt-px size-[18px] shrink-0" />
          <span className="font-medium text-primary text-sm">
            {syncStatus.warning}
          </span>
        </div>
      )}
      <p className="text-paragraph-15 md:text-paragraph-16">
        The chart shows the actual size of data posted to the DA Layer per day
        for the selected time period, as well as the maximum possible throughput
        per day.
      </p>
      <HorizontalSeparator className="my-4" />
      <ThroughputSectionChart
        daLayer={projectId}
        configuredThroughputs={throughput}
        customColors={customColors}
        milestones={milestones}
      />
      <HorizontalSeparator className="my-4" />
      <ChartStats>
        <ChartStatsItem
          label="Past day avg. throughput"
          isSynced={syncStatus.isSynced}
        >
          {pastDayAvgThroughputPerSecond
            ? formatBpsToMbps(pastDayAvgThroughputPerSecond)
            : undefined}
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
          {largestPoster ? (
            <a href={largestPoster.href}>
              {largestPoster.name} ({largestPoster.percentage}%)
            </a>
          ) : undefined}
        </ChartStatsItem>
        <ChartStatsItem
          label="Past day total data posted"
          isSynced={syncStatus.isSynced}
        >
          {totalPosted ? formatBytes(totalPosted) : undefined}
        </ChartStatsItem>
      </ChartStats>
    </ProjectSection>
  )
}
