import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ThroughputSectionChart } from '~/components/chart/data-availability/ThroughputSectionChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ClockIcon } from '~/icons/Clock'
import {
  IncludeScalingOnlyProvider,
  useIncludeScalingOnly,
} from '~/pages/data-availability/throughput/components/DaThroughputContext'
import { api } from '~/trpc/React'
import { formatBpsToMbps, formatBytes } from '~/utils/number-format/formatBytes'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface ThroughputSectionProps extends ProjectSectionProps {
  project: ChartProject
  throughput: DaLayerThroughput[]
  customColors: Record<string, string> | undefined
  syncStatus: {
    warning: string | undefined
    isSynced: boolean
  }
  milestones: Milestone[]
}

export function ThroughputSection({
  project,
  throughput,
  customColors,
  syncStatus,
  milestones,
  ...sectionProps
}: ThroughputSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <IncludeScalingOnlyProvider>
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
          for the selected time period, as well as the maximum possible
          throughput per day.
        </p>
        <HorizontalSeparator className="my-4" />
        <ThroughputSectionChart
          project={project}
          configuredThroughputs={throughput}
          customColors={customColors}
          milestones={milestones}
        />
        <HorizontalSeparator className="my-4" />
        <ThroughputChartStats projectId={project.id} syncStatus={syncStatus} />
      </IncludeScalingOnlyProvider>
    </ProjectSection>
  )
}

function ThroughputChartStats({
  projectId,
  syncStatus,
}: {
  projectId: ProjectId
  syncStatus: {
    warning: string | undefined
    isSynced: boolean
  }
}) {
  const { includeScalingOnly } = useIncludeScalingOnly()
  const { data, isLoading } = api.da.projectCharts.useQuery({
    range: { type: '1y' },
    projectId,
    includeScalingOnly,
  })

  return (
    <ChartStats>
      <ChartStatsItem
        label="Past day avg. throughput"
        isSynced={syncStatus.isSynced}
        isLoading={isLoading}
      >
        {data?.stats.pastDayAvgThroughputPerSecond
          ? formatBpsToMbps(data?.stats.pastDayAvgThroughputPerSecond)
          : undefined}
      </ChartStatsItem>
      <ChartStatsItem
        label="Past day avg. capacity used"
        isSynced={syncStatus.isSynced}
        isLoading={isLoading}
      >
        {data?.stats.pastDayAvgCapacityUtilization === null ? (
          <NotApplicableBadge />
        ) : data?.stats.pastDayAvgCapacityUtilization ? (
          `${data.stats.pastDayAvgCapacityUtilization}%`
        ) : undefined}
      </ChartStatsItem>
      <ChartStatsItem
        label="Past day largest poster"
        isSynced={syncStatus.isSynced}
        isLoading={isLoading}
      >
        {data?.stats.largestPoster ? (
          <a href={data.stats.largestPoster.href}>
            {data.stats.largestPoster.name} (
            {data.stats.largestPoster.percentage}%)
          </a>
        ) : undefined}
      </ChartStatsItem>
      <ChartStatsItem
        label="Past day total data posted"
        isSynced={syncStatus.isSynced}
        isLoading={isLoading}
      >
        {data?.stats.totalPosted
          ? formatBytes(data.stats.totalPosted)
          : undefined}
      </ChartStatsItem>
    </ChartStats>
  )
}
