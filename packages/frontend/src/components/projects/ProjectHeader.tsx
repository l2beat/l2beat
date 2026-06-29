import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import type { ProjectVersionSwitcher as ProjectVersionSwitcherData } from '~/utils/project/projectVersions'
import { LiveIndicator } from '../LiveIndicator'
import { SearchBarButton } from '../search-bar/SearchBarButton'
import { ProjectVersionSwitcher } from './ProjectVersionSwitcher'

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
  /** Switcher between different versions of the project (e.g. CCTP v1/v2). */
  versions?: ProjectVersionSwitcherData
  livenessSectionHref?: string
  className?: string
}

export function ProjectHeader({
  project,
  ongoingAnomaly,
  recentUpdatesCount,
  secondLine,
  versions,
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
            <ProjectTitle name={project.name} versions={versions} />
            {secondLine && (
              <span className="font-bold text-label-value-15 text-secondary">
                {secondLine}
              </span>
            )}
          </div>
        </h1>
        <div className="flex flex-col gap-2 max-md:w-full md:flex-row md:items-center">
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

function ProjectTitle({
  name,
  versions,
}: {
  name: string
  versions?: ProjectVersionSwitcherData
}) {
  const titleClassName = 'text-heading-28 leading-none!'

  if (!versions) {
    return <span className={titleClassName}>{name}</span>
  }

  // Underline the current version's label inside the title and turn it into the
  // switcher (e.g. "CCTP v1" -> "CCTP " + switchable "v1").
  const index = name.lastIndexOf(versions.current)
  if (index === -1) {
    // Title doesn't contain the label; fall back to appending the switcher.
    return (
      <span className={cn(titleClassName, 'inline-flex items-center gap-2')}>
        {name}
        <ProjectVersionSwitcher versions={versions} />
      </span>
    )
  }

  return (
    <span className={titleClassName}>
      {name.slice(0, index)}
      <ProjectVersionSwitcher versions={versions} />
      {name.slice(index + versions.current.length)}
    </span>
  )
}
