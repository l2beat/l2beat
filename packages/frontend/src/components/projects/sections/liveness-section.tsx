import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { DurationCell } from '~/app/(side-nav)/scaling/finality/_components/table/duration-cell'
import { AnomalyIndicator } from '~/app/(side-nav)/scaling/liveness/_components/anomaly-indicator'
import { ProjectLivenessChart } from '~/components/chart/liveness/project-liveness-chart'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/chart-stats'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'
import compact from 'lodash/compact'
import { Fragment } from 'react'
import { cn } from '~/utils/cn'

export interface LivenessSectionProps extends ProjectSectionProps {
  projectId: string
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  disableAnomalies: boolean
  hasTrackedContractsChanged: boolean
  batchSubmissionsAvg: number | undefined
  stateUpdatesAvg: number | undefined
  proofSubmissionsAvg: number | undefined
}

export function LivenessSection({
  projectId,
  configuredSubtypes,
  anomalies,
  batchSubmissionsAvg,
  stateUpdatesAvg,
  proofSubmissionsAvg,
  disableAnomalies,
  hasTrackedContractsChanged,
  ...sectionProps
}: LivenessSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-base">
        The chart illustrates how &quot;live&quot; the project&apos;s operators
        are by displaying how frequently they submit transactions of the
        selected type and if these intervals deviate from their typical
        schedule.
      </p>
      <HorizontalSeparator className="my-4" />
      <ProjectLivenessChart
        projectId={projectId}
        configuredSubtypes={configuredSubtypes}
      />
      <LivenessChartStats
        disableAnomalies={disableAnomalies}
        batchSubmissionsAvg={batchSubmissionsAvg}
        stateUpdatesAvg={stateUpdatesAvg}
        proofSubmissionsAvg={proofSubmissionsAvg}
        anomalies={anomalies}
        hasTrackedContractsChanged={hasTrackedContractsChanged}
      />
    </ProjectSection>
  )
}

function LivenessChartStats({
  disableAnomalies,
  batchSubmissionsAvg,
  stateUpdatesAvg,
  proofSubmissionsAvg,
  anomalies,
  hasTrackedContractsChanged,
}: {
  disableAnomalies: boolean
  batchSubmissionsAvg: number | undefined
  stateUpdatesAvg: number | undefined
  proofSubmissionsAvg: number | undefined
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
}) {
  const elements = compact([
    batchSubmissionsAvg && (
      <ChartStatsItem label="30D avg. tx data subs. interval">
        <DurationCell durationInSeconds={batchSubmissionsAvg} />
      </ChartStatsItem>
    ),
    proofSubmissionsAvg && (
      <ChartStatsItem label="30D avg. proof subs. interval">
        <DurationCell durationInSeconds={proofSubmissionsAvg} />
      </ChartStatsItem>
    ),
    stateUpdatesAvg && (
      <ChartStatsItem label="30D avg. state updates interval">
        <DurationCell durationInSeconds={stateUpdatesAvg} />
      </ChartStatsItem>
    ),
    !disableAnomalies && (
      <ChartStatsItem label="Past 30 days anomalies">
        <AnomalyIndicator
          anomalies={anomalies}
          hasTrackedContractsChanged={hasTrackedContractsChanged}
        />
      </ChartStatsItem>
    ),
  ])

  return (
    <ChartStats
      className={cn(
        'mt-4',
        elements.length === 1 && 'lg:grid-cols-1',
        elements.length === 2 && 'lg:grid-cols-2',
        elements.length === 3 && 'lg:grid-cols-3',
        elements.length === 4 && 'lg:grid-cols-4',
      )}
    >
      {elements.map((element, index) => (
        <Fragment key={index}>{element}</Fragment>
      ))}
    </ChartStats>
  )
}
