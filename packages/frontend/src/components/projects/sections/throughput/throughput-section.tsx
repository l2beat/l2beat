import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { SyncStatusWrapper } from '~/app/(side-nav)/scaling/finality/_components/table/sync-status-wrapper'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { ProjectDaThroughputChart } from '~/components/chart/data-availability/project-da-throughput-chart'
import { ChartStats } from '~/components/core/chart/chart-stats'
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
      <ChartStats columns={4}>
        <Detail
          label="Past day avg. throughput"
          value={formatBpsToMbps(pastDayAvgThroughputPerSecond)}
          isSynced={syncStatus.isSynced}
        />
        <Detail
          label="Past day avg. capacity used"
          value={`${pastDayAvgCapacityUtilization}%`}
          isSynced={syncStatus.isSynced}
        />
        <Detail
          label="Past day largest poster"
          value={
            largestPoster
              ? `${largestPoster.name} (${largestPoster.percentage}%)`
              : undefined
          }
          isSynced={syncStatus.isSynced}
        />
        <Detail
          label="Past day total data posted"
          value={formatBytes(totalPosted)}
          isSynced={syncStatus.isSynced}
        />
      </ChartStats>
    </ProjectSection>
  )
}

function Detail({
  label,
  value,
  isSynced,
}: { label: string; value: string | undefined; isSynced: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 md:flex-col md:items-start">
      <span className="whitespace-nowrap text-xs font-medium text-secondary">
        {label}
      </span>
      {value ? (
        <SyncStatusWrapper isSynced={isSynced}>
          <span className="text-sm font-medium text-primary xs:text-lg md:font-bold">
            {value}
          </span>
        </SyncStatusWrapper>
      ) : (
        <NoDataBadge />
      )}
    </div>
  )
}
