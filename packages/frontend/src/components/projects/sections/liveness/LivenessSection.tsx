import type { Milestone } from '@l2beat/config'
import { pluralize, type TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import React from 'react'
import { Callout } from '~/components/Callout'
import { ProjectLivenessChart } from '~/components/chart/liveness/ProjectLivenessChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { LiveIndicator } from '~/components/LiveIndicator'
import { TrackedTxsOutageNotice } from '~/components/TrackedTxsOutageNotice'
import { env } from '~/env'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { AnomalyText } from '~/pages/layer2s/liveness/components/AnomalyText'
import { NoAnomaliesState } from '~/pages/layer2s/liveness/components/NoRecentAnomaliesState'
import type { LivenessAnomaly } from '~/server/features/layer2s/liveness/types'
import { isAnomalyOngoing } from '~/utils/project/liveness/isAnomalyOngoing'
import type { TrackedTransactionsByType } from '~/utils/project/tracked-txs/getTrackedTransactions'
import type { ChartRange } from '~/utils/range/range'
import { TrackedTransactions } from '../costs/TrackedTransactions'
import { ProjectSection } from '../ProjectSection'
import { SubsectionHeading } from '../Subsection'
import {
  DA_BRIDGE_LIVENESS_DESCRIPTION,
  LIVENESS_DESCRIPTION,
  TRACKED_CONTRACTS_CHANGED_WARNING,
} from '../sectionCopy'
import type { ProjectSectionProps } from '../types'
import { Last30DayAnomalies } from './Last30DayAnomalies'

export interface LivenessSectionProps extends ProjectSectionProps {
  project: ChartProject
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
  trackedTransactions: TrackedTransactionsByType
  duplicateData?: {
    from: TrackedTxsConfigSubtype
    to: TrackedTxsConfigSubtype
  }
  milestones: Milestone[]
  defaultRange: ChartRange
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
  duplicateData,
  milestones,
  defaultRange,
  isArchived,
  hideSubtypeSwitch,
  isForDaBridge,
  ...sectionProps
}: LivenessSectionProps) {
  const ongoingAnomalies = anomalies.filter(isAnomalyOngoing)
  return (
    <ProjectSection {...sectionProps}>
      <p className="mb-4 text-paragraph-15 md:text-paragraph-16">
        {isForDaBridge ? DA_BRIDGE_LIVENESS_DESCRIPTION : LIVENESS_DESCRIPTION}
      </p>
      {env.CLIENT_SIDE_TRACKED_TXS_OUTAGE && (
        <TrackedTxsOutageNotice type="section" />
      )}
      {!isArchived && (
        <OngoingAnomalies
          anomalies={ongoingAnomalies}
          hasTrackedContractsChanged={hasTrackedContractsChanged}
        />
      )}

      <HorizontalSeparator className="my-4" />
      <ProjectLivenessChart
        project={project}
        configuredSubtypes={configuredSubtypes}
        anomalies={anomalies}
        milestones={milestones}
        defaultRange={defaultRange}
        isArchived={isArchived}
        hideSubtypeSwitch={hideSubtypeSwitch}
      />
      <div className="mt-4">
        <TrackedTransactions
          {...trackedTransactions}
          duplicateData={duplicateData}
        />
      </div>
      {!isArchived && (
        <>
          <HorizontalSeparator className="my-6" />
          <Last30DayAnomalies
            anomalies={anomalies}
            hasTrackedContractsChanged={hasTrackedContractsChanged}
          />
        </>
      )}
    </ProjectSection>
  )
}

function OngoingAnomalies({
  anomalies,
  hasTrackedContractsChanged,
}: {
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
}) {
  if (anomalies.length === 0) {
    return <NoAnomaliesState className="rounded-lg!" type="ongoing" />
  }

  const approvedAnomalies = anomalies.filter((anomaly) => anomaly.isApproved)
  const unapprovedAnomalies = anomalies.filter((anomaly) => !anomaly.isApproved)

  return (
    <div className="flex flex-col gap-4">
      {approvedAnomalies.length > 0 && (
        <div className="rounded-lg bg-surface-secondary px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <LiveIndicator size="md" />
            <SubsectionHeading className="font-medium text-base text-negative uppercase">
              Ongoing{' '}
              {pluralize(approvedAnomalies.length, 'anomaly', 'anomalies')}
            </SubsectionHeading>
          </div>
          {hasTrackedContractsChanged && <ImplementationChangeCallout />}
          {approvedAnomalies.map((anomaly) => (
            <React.Fragment key={`${anomaly.start}-${anomaly.subtype}`}>
              <AnomalyText anomaly={anomaly} />
              <HorizontalSeparator className="my-2 last:hidden" />
            </React.Fragment>
          ))}
        </div>
      )}
      {unapprovedAnomalies.length > 0 && (
        <div className="rounded-lg bg-surface-secondary px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <RoundedWarningIcon className="size-4" sentiment="warning" />
            <SubsectionHeading className="font-medium text-base text-warning uppercase">
              Potential ongoing{' '}
              {pluralize(unapprovedAnomalies.length, 'anomaly', 'anomalies')}
            </SubsectionHeading>
          </div>
          {hasTrackedContractsChanged && <ImplementationChangeCallout />}
          {unapprovedAnomalies.map((anomaly) => (
            <React.Fragment key={`${anomaly.start}-${anomaly.subtype}`}>
              <AnomalyText anomaly={anomaly} />
              <HorizontalSeparator className="my-2 last:hidden" />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

function ImplementationChangeCallout() {
  return (
    <Callout
      className="mb-3 rounded px-3 py-2 text-[13px] leading-[130%]"
      color="yellow"
      small
      icon={<RoundedWarningIcon className="size-4" sentiment="warning" />}
      body={TRACKED_CONTRACTS_CHANGED_WARNING}
    />
  )
}
