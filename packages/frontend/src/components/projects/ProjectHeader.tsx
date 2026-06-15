import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { LiveIndicator } from '../LiveIndicator'
import { SearchBarButton } from '../search-bar/SearchBarButton'

interface Project {
  name: string
  slug: string
  icon: string
}

interface Props {
  project: Project
  ongoingAnomaly?: 'single' | 'multiple'
  recentUpdatesCount?: number
  secondLine?: string
  livenessSectionHref?: string
  className?: string
}

export function ProjectHeader({
  project,
  ongoingAnomaly,
  recentUpdatesCount,
  secondLine,
  livenessSectionHref = '#liveness',
  className,
}: Props) {
  return (
    <div
      className={cn('mb-6 flex items-start justify-between gap-4', className)}
    >
      <div
        className={cn(
          'mt-1 flex w-full flex-wrap gap-6 max-md:flex-col md:items-center',
          (!!ongoingAnomaly || !!recentUpdatesCount) && 'max-md:mb-4',
        )}
      >
        <h1 className="flex items-center justify-start gap-3">
          {project.slug && (
            <img
              width={32}
              height={32}
              src={project.icon}
              alt={`${project.name} logo`}
            />
          )}
          <div className="flex flex-col">
            <span className="text-heading-28 leading-none!">
              {project.name}
            </span>
            {secondLine && (
              <span className="font-bold text-label-value-15 text-secondary">
                {secondLine}
              </span>
            )}
          </div>
        </h1>
        <div className="flex flex-col gap-2 max-md:w-full md:contents">
          {!!ongoingAnomaly && (
            <a
              href={livenessSectionHref}
              className="flex h-8 items-center justify-center gap-2 rounded border border-negative p-2"
            >
              <LiveIndicator />
              <h3 className="font-medium text-negative text-xs uppercase leading-none">
                {ongoingAnomaly === 'single'
                  ? 'Ongoing anomaly'
                  : 'Ongoing anomalies'}
              </h3>
              <ChevronIcon className="-rotate-90 size-2.5 fill-negative" />
            </a>
          )}
          {!!recentUpdatesCount && (
            <a
              href="#updates"
              className="flex h-8 items-center justify-center gap-2 rounded border border-brand p-2"
            >
              <h3 className="font-medium text-brand text-xs uppercase leading-none">
                {recentUpdatesCount === 1
                  ? '1 recent update'
                  : `${recentUpdatesCount} recent updates`}
              </h3>
              <ChevronIcon className="-rotate-90 size-2.5 fill-brand" />
            </a>
          )}
        </div>
      </div>
      <SearchBarButton className="max-lg:hidden" label="Search projects" />
    </div>
  )
}
