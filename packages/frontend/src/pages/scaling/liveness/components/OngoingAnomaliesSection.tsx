import { LiveIndicator } from '~/components/LiveIndicator'
import { formatDuration } from '~/components/chart/liveness/LivenessChart'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import { VerifiedIcon } from '~/icons/Verified'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { anomalySubtypeToLabel } from './AnomalyIndicator'
import { getDurationColorClassName } from './LivenessDurationCell'

export interface ProjectWithAnomaly {
  name: string
  slug: string
  anomalies: LivenessAnomaly[]
}

interface Props {
  projectsWithAnomalies: ProjectWithAnomaly[]
  className?: string
}

export function OngoingAnomaliesSection({
  projectsWithAnomalies,
  className,
}: Props) {
  if (projectsWithAnomalies.length === 0) {
    return (
      <PrimaryCard
        className={cn(
          'flex items-center justify-center gap-1 border border-positive max-md:border-x-0',
          className,
        )}
      >
        <VerifiedIcon className="size-5 fill-positive" />
        <span className="text-center font-medium text-positive leading-none">
          No ongoing anomalies detected
        </span>
      </PrimaryCard>
    )
  }

  return (
    <PrimaryCard className={className}>
      <div className="flex items-center gap-2">
        <LiveIndicator size="md" />
        <h2 className={'font-bold text-lg text-negative'}>Ongoing anomalies</h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {projectsWithAnomalies.map((projectWithAnomalies) => (
          <AnomalyCollapsible
            key={projectWithAnomalies.name}
            projectWithAnomalies={projectWithAnomalies}
          />
        ))}
      </div>
    </PrimaryCard>
  )
}

function AnomalyCollapsible({
  projectWithAnomalies,
}: {
  projectWithAnomalies: ProjectWithAnomaly
}) {
  return (
    <Collapsible
      key={projectWithAnomalies.name}
      className="h-fit rounded bg-surface-secondary"
    >
      <CollapsibleTrigger className="group flex w-full items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src={`/icons/${projectWithAnomalies.slug}.png`}
            alt={projectWithAnomalies.name}
            className="size-5"
          />
          <span className="text-left font-bold text-base leading-none">
            {projectWithAnomalies.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left leading-none transition-opacity duration-300 group-data-[state=open]:opacity-0">
            {projectWithAnomalies.anomalies.length === 1 ? (
              <span
                className={cn(
                  'font-medium text-xs leading-none',
                  getDurationColorClassName(
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    projectWithAnomalies.anomalies[0]!.durationInSeconds,
                  ),
                )}
              >
                {anomalySubtypeToLabel(
                  // biome-ignore lint/style/noNonNullAssertion: it's there for sure
                  projectWithAnomalies.anomalies[0]!.subtype,
                )}
              </span>
            ) : (
              <span
                className={cn(
                  'font-medium text-xs leading-none',
                  getDurationColorClassName(
                    Math.max(
                      ...projectWithAnomalies.anomalies.map(
                        (a) => a.durationInSeconds,
                      ),
                    ),
                  ),
                )}
              >
                Multiple anomalies
              </span>
            )}
          </div>
          <ChevronIcon className="group-data-[state=open]:-rotate-180 size-3 fill-brand transition-transform duration-300" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4">
        <div className="flex flex-col gap-2">
          {projectWithAnomalies.anomalies.map((anomaly) => {
            return (
              <div key={anomaly.start} className="text-xs last:mb-3">
                <HorizontalSeparator className="my-3 first:mt-0" />

                <div className="flex items-center justify-between">
                  <span className="font-medium text-secondary">Type:</span>
                  <span className="font-bold">
                    {anomalySubtypeToLabel(anomaly.subtype)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-secondary">Duration:</span>
                  <span
                    className={cn(
                      'font-bold',
                      getDurationColorClassName(anomaly.durationInSeconds),
                    )}
                  >
                    {formatDuration(anomaly.durationInSeconds)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-secondary">Start:</span>
                  <span className="font-bold">
                    {formatTimestamp(anomaly.start, {
                      mode: 'datetime',
                    })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
