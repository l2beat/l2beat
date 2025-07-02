import type { Milestone } from '@l2beat/config'
import { type TrackedTxsConfigSubtype, pluralize } from '@l2beat/shared-pure'
import { LiveIndicator } from '~/components/LiveIndicator'
import { formatDuration } from '~/components/chart/liveness/LivenessChart'
import { ProjectLivenessChart } from '~/components/chart/liveness/ProjectLivenessChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { anomalySubtypeToLabel } from '~/pages/scaling/liveness/components/AnomalyIndicator'
import { getDurationColorClassName } from '~/pages/scaling/liveness/components/LivenessDurationCell'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import type { TrackedTransactionsByType } from '~/utils/project/tracked-txs/getTrackedTransactions'
import { ProjectSection } from './ProjectSection'
import { TrackedTransactions } from './costs/TrackedTransactions'
import type { ProjectSectionProps } from './types'

export interface LivenessSectionProps extends ProjectSectionProps {
  projectId: string
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
  trackedTransactions: TrackedTransactionsByType
  milestones: Milestone[]
}

export function LivenessSection({
  projectId,
  configuredSubtypes,
  anomalies,
  hasTrackedContractsChanged,
  trackedTransactions,
  milestones,
  ...sectionProps
}: LivenessSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <OngoingAnomalies
        anomalies={anomalies.filter((a) => a.end === undefined)}
      />
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
        anomalies={anomalies}
        hasTrackedContractsChanged={hasTrackedContractsChanged}
        milestones={milestones}
      />
      <div className="mt-4">
        <TrackedTransactions {...trackedTransactions} />
      </div>
    </ProjectSection>
  )
}

export function OngoingAnomalies({
  anomalies,
}: { anomalies: LivenessAnomaly[] }) {
  return (
    <div className="mb-4 rounded-lg bg-surface-secondary px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <LiveIndicator />
        <h3 className="font-medium text-negative text-xs uppercase">
          Ongoing {pluralize(anomalies.length, 'anomaly', 'anomalies')}
        </h3>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left font-medium text-secondary ">
            <th className="w-1/2 pr-2 lg:w-1/3">Type</th>
            <th className="w-1/2 pr-2 lg:w-1/3">Duration</th>
            <th className="w-1/3 max-lg:hidden">Start</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {anomalies.map((anomaly) => {
            const formattedStart = formatTimestamp(anomaly.start, {
              mode: 'datetime',
            })
            return (
              <tr
                key={`${anomaly.subtype}-${anomaly.start}`}
                className="font-bold"
              >
                <td className="pr-2">
                  {anomalySubtypeToLabel(anomaly.subtype)}
                </td>
                <td
                  className={cn(
                    'pr-2',
                    getDurationColorClassName(anomaly.durationInSeconds),
                  )}
                >
                  <p>{formatDuration(anomaly.durationInSeconds)}</p>
                  <p className="text-2xs text-secondary lg:hidden">
                    {formattedStart}
                  </p>
                </td>
                <td className="max-lg:hidden">{formattedStart}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
