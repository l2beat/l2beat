import { LiveIndicator } from '~/components/LiveIndicator'
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
import { AnomalyText } from './AnomalyText'
import { NoAnomaliesState } from './NoRecentAnomaliesState'

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
      <div className="flex items-center gap-2">
        <LiveIndicator size="md" />
        <h2 className="font-bold text-lg text-negative">
          Major ongoing anomalies
        </h2>
      </div>
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
          <span className="label-value-14-bold md:label-value-16-bold text-left">
            {projectWithAnomalies.name}
          </span>
        </div>
        <ChevronIcon className="group-data-[state=open]:-rotate-180 size-3 fill-brand transition-transform duration-300" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 px-4 pb-3">
        <div className="flex flex-col gap-2">
          {projectWithAnomalies.recentAnomalies.map((anomaly) => {
            return (
              <div key={anomaly.start} className="text-xs">
                <HorizontalSeparator className="my-3 first:mt-0" />
                <AnomalyText anomaly={anomaly} />
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
