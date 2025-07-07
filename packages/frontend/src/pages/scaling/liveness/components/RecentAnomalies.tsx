import { LiveIndicator } from '~/components/LiveIndicator'
import { formatDuration } from '~/components/chart/liveness/LivenessChart'
import { Button } from '~/components/core/Button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { anomalySubtypeToLabel } from './AnomalyIndicator'
import { getDurationColorClassName } from './LivenessDurationCell'
import { NoAnomaliesState } from './NoRecentAnomaliesState'
import { OngoingAnomalyBanner } from './OngoingAnomalyBanner'

export interface ProjectWithAnomaly {
  name: string
  slug: string
  recentAnomalies: LivenessAnomaly[]
}

interface Props {
  projectsWithAnomalies: ProjectWithAnomaly[]
  className?: string
}

export function RecentAnomalies({ projectsWithAnomalies, className }: Props) {
  if (projectsWithAnomalies.length === 0) {
    return (
      <NoAnomaliesState
        className={cn('max-md:border-x-0', className)}
        type="recent"
      />
    )
  }
  const firstColumns = projectsWithAnomalies.filter(
    (_, index) => index % 3 === 0,
  )
  const secondColumns = projectsWithAnomalies.filter(
    (_, index) => index % 3 === 1,
  )
  const thirdColumns = projectsWithAnomalies.filter(
    (_, index) => index % 3 === 2,
  )

  return (
    <PrimaryCard className={className}>
      <h2 className="font-bold text-lg">Recent major anomalies</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          {firstColumns.map((projectWithAnomalies) => (
            <AnomalyCollapsible
              key={projectWithAnomalies.name}
              projectWithAnomalies={projectWithAnomalies}
            />
          ))}
        </div>
        <div className="space-y-3">
          {secondColumns.map((projectWithAnomalies) => (
            <AnomalyCollapsible
              key={projectWithAnomalies.name}
              projectWithAnomalies={projectWithAnomalies}
            />
          ))}
        </div>
        <div className="space-y-3">
          {thirdColumns.map((projectWithAnomalies) => (
            <AnomalyCollapsible
              key={projectWithAnomalies.name}
              projectWithAnomalies={projectWithAnomalies}
            />
          ))}
        </div>
      </div>
    </PrimaryCard>
  )
}

function AnomalyCollapsible({
  projectWithAnomalies,
}: {
  projectWithAnomalies: ProjectWithAnomaly
}) {
  const isAnyOngoing = projectWithAnomalies.recentAnomalies.some(
    (anomaly) => anomaly.end === undefined,
  )
  return (
    <Collapsible
      key={projectWithAnomalies.name}
      className="h-fit rounded bg-surface-secondary"
    >
      <CollapsibleTrigger className="group flex w-full items-center justify-between rounded px-4 py-3">
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
          {isAnyOngoing ? (
            <div className="flex items-center gap-1">
              <LiveIndicator />
              <span className="font-medium text-2xs text-negative uppercase">
                Ongoing
              </span>
            </div>
          ) : (
            <span className="font-medium text-2xs text-secondary uppercase">
              Resolved
            </span>
          )}
          <ChevronIcon className="group-data-[state=open]:-rotate-180 size-3 fill-brand transition-transform duration-300" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 px-4 pb-3">
        <div className="flex flex-col gap-2">
          {projectWithAnomalies.recentAnomalies.map((anomaly) => {
            return (
              <div key={anomaly.start} className="text-xs">
                <HorizontalSeparator className="my-3 first:mt-0" />
                {anomaly.end === undefined && <OngoingAnomalyBanner />}
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
                  <span className="font-medium text-secondary">
                    Avg. interval:
                  </span>
                  <span
                    className={cn(
                      'font-bold',
                      getDurationColorClassName(anomaly.avgInterval),
                    )}
                  >
                    {formatDuration(anomaly.avgInterval)}
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
                {anomaly.end && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-secondary">End:</span>
                    <span className="font-bold">
                      {formatTimestamp(anomaly.end, {
                        mode: 'datetime',
                      })}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mb-3 w-full py-1"
          asChild
        >
          <a href={`/scaling/projects/${projectWithAnomalies.slug}#liveness`}>
            See more details
          </a>
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}
