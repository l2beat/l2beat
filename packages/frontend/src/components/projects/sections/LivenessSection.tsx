import type { Milestone } from '@l2beat/config'
import { type TrackedTxsConfigSubtype, pluralize } from '@l2beat/shared-pure'
import { LiveIndicator } from '~/components/LiveIndicator'
import { formatDuration } from '~/components/chart/liveness/LivenessChart'
import { ProjectLivenessChart } from '~/components/chart/liveness/ProjectLivenessChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { anomalySubtypeToLabel } from '~/pages/scaling/liveness/components/AnomalyIndicator'
import { getDurationColorClassName } from '~/pages/scaling/liveness/components/LivenessDurationCell'
import { NoOngoingAnomaliesState } from '~/pages/scaling/liveness/components/NoOngoingAnomaliesState'
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
  const ongoingAnomalies = anomalies.filter((a) => a.end === undefined)
  return (
    <ProjectSection {...sectionProps}>
      <p className="mb-4 text-base">
        This section shows how &quot;live&quot; the project&apos;s operators are
        are by displaying how frequently they submit transactions of the
        selected type. It also highlights anomalies - significant deviations
        from their typical schedule.
      </p>
      <OngoingAnomalies anomalies={ongoingAnomalies} />

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
  if (anomalies.length === 0) {
    return <NoOngoingAnomaliesState className="!rounded-lg" />
  }

  return (
    <div className="rounded-lg bg-surface-secondary px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <LiveIndicator size="md" />
        <h3 className="font-medium text-base text-negative uppercase">
          Ongoing {pluralize(anomalies.length, 'anomaly', 'anomalies')}
        </h3>
      </div>
      <table className="w-full">
        <thead className="text-xs">
          <tr className="text-left font-medium text-secondary">
            <th className="w-1/2 pr-2 pb-2 lg:w-1/3">Type</th>
            <th className="w-1/2 pr-2 pb-2 lg:w-1/3">Duration</th>
            <th className="w-1/3 pb-2 max-lg:hidden">Start</th>
          </tr>
        </thead>
        <tbody className="!leading-none align-top text-sm md:text-lg">
          {anomalies.map((anomaly) => {
            const formattedStart = formatTimestamp(anomaly.start, {
              mode: 'datetime',
            })
            return (
              <tr
                key={`${anomaly.subtype}-${anomaly.start}`}
                className="font-bold"
              >
                <td className="pr-2 pb-1">
                  {anomalySubtypeToLabel(anomaly.subtype)}
                </td>
                <td
                  className={cn(
                    'pr-2 pb-1',
                    getDurationColorClassName(anomaly.durationInSeconds),
                  )}
                >
                  <p>{formatDuration(anomaly.durationInSeconds)}</p>
                  <p className="text-2xs text-secondary lg:hidden">
                    {formattedStart}
                  </p>
                </td>
                <td className="pb-1 max-lg:hidden">{formattedStart}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
