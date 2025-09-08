import type { Milestone } from '@l2beat/config'
import { pluralize, type TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import React from 'react'
import { ProjectLivenessChart } from '~/components/chart/liveness/ProjectLivenessChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { LiveIndicator } from '~/components/LiveIndicator'
import { AnomalyText } from '~/pages/scaling/liveness/components/AnomalyText'
import { NoAnomaliesState } from '~/pages/scaling/liveness/components/NoRecentAnomaliesState'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import type { LivenessChartTimeRange } from '~/server/features/scaling/liveness/utils/chartRange'
import type { TrackedTransactionsByType } from '~/utils/project/tracked-txs/getTrackedTransactions'
import { TrackedTransactions } from './costs/TrackedTransactions'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface LivenessSectionProps extends ProjectSectionProps {
  project: ChartProject
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
  trackedTransactions: TrackedTransactionsByType
  milestones: Milestone[]
  defaultRange: LivenessChartTimeRange
  isArchived: boolean
  hideSubtypeSwitch?: boolean
  isForDaBridge?: boolean
}

export function LivenessSection({
  project,
  configuredSubtypes,
  anomalies,
  hasTrackedContractsChanged,
  trackedTransactions,
  milestones,
  defaultRange,
  isArchived,
  hideSubtypeSwitch,
  isForDaBridge,
  ...sectionProps
}: LivenessSectionProps) {
  const ongoingAnomalies = anomalies.filter((a) => a.end === undefined)
  return (
    <ProjectSection {...sectionProps}>
      <p className="mb-4 text-paragraph-15 md:text-paragraph-16">
        {!isForDaBridge
          ? 'This section shows how "live" the project\'s operators are by displaying how frequently they submit transactions of the selected type. It also highlights anomalies - significant deviations from their typical schedule.'
          : 'This section shows how frequently DA attestations are submitted. It also highlights anomalies - significant deviations from the typical schedule.'}
      </p>
      {!isArchived && <OngoingAnomalies anomalies={ongoingAnomalies} />}

      <HorizontalSeparator className="my-4" />
      <ProjectLivenessChart
        project={project}
        configuredSubtypes={configuredSubtypes}
        anomalies={anomalies}
        hasTrackedContractsChanged={hasTrackedContractsChanged}
        milestones={milestones}
        defaultRange={defaultRange}
        isArchived={isArchived}
        hideSubtypeSwitch={hideSubtypeSwitch}
      />
      <div className="mt-4">
        <TrackedTransactions {...trackedTransactions} />
      </div>
    </ProjectSection>
  )
}

function OngoingAnomalies({ anomalies }: { anomalies: LivenessAnomaly[] }) {
  if (anomalies.length === 0) {
    return <NoAnomaliesState className="rounded-lg!" type="ongoing" />
  }

  return (
    <div className="rounded-lg bg-surface-secondary px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <LiveIndicator size="md" />
        <h3 className="font-medium text-base text-negative uppercase">
          Ongoing {pluralize(anomalies.length, 'anomaly', 'anomalies')}
        </h3>
      </div>
      {anomalies.map((anomaly) => (
        <React.Fragment key={`${anomaly.start}-${anomaly.subtype}`}>
          <AnomalyText anomaly={anomaly} />
          <HorizontalSeparator className="my-2 last:hidden" />
        </React.Fragment>
      ))}
    </div>
  )
}
