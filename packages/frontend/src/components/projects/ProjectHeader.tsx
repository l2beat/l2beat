import type { ReactNode } from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import type {
  ProjectSection,
  ProjectSectionLink,
} from '~/server/features/projects/getProjectSectionLinks'
import { cn } from '~/utils/cn'
import { LiveIndicator } from '../LiveIndicator'
import { SearchBarButton } from '../search-bar/SearchBarButton'
import { PROJECT_SECTIONS } from './projectSections'

interface Project {
  name: string
  slug: string
  icon: string
}

interface Props {
  project: Project
  /** The section this page belongs to, shown as a breadcrumb above the name */
  section?: ProjectSection
  /** The project's page in each section; the ones besides `section` show as "Also in" links */
  sectionLinks?: ProjectSectionLink[]
  ongoingAnomaly?: 'single' | 'multiple'
  recentUpdatesCount?: number
  secondLine?: ReactNode
  livenessSectionHref?: string
  className?: string
}

export function ProjectHeader({
  project,
  section,
  sectionLinks,
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
      <div className="mt-1 flex w-full min-w-0 flex-col gap-2">
        {section && (
          <ProjectSectionBreadcrumb
            section={section}
            otherSections={sectionLinks?.filter(
              (link) => link.section !== section,
            )}
          />
        )}
        <div
          className={cn(
            'flex w-full flex-wrap gap-x-4 gap-y-3 max-md:flex-col md:items-center',
            (!!ongoingAnomaly || !!recentUpdatesCount) && 'max-md:mb-4',
          )}
        >
          <h1 className="project-title-timeline flex items-center justify-start gap-3">
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
          <div className="flex flex-wrap gap-1.5 md:items-center">
            {!!ongoingAnomaly && (
              <a
                href={livenessSectionHref}
                className="flex h-6 items-center justify-center gap-1.5 rounded border border-negative px-2"
              >
                <LiveIndicator />
                <span className="font-medium text-2xs text-negative uppercase leading-none">
                  {ongoingAnomaly === 'single'
                    ? 'Ongoing anomaly'
                    : 'Ongoing anomalies'}
                </span>
                <ChevronIcon className="-rotate-90 size-2 fill-negative" />
              </a>
            )}
            {!!recentUpdatesCount && (
              <a
                href="#updates"
                className="flex h-6 items-center justify-center gap-1.5 rounded border border-divider bg-surface-primary px-2"
              >
                <span className="font-medium text-2xs text-secondary uppercase leading-none">
                  {recentUpdatesCount === 1
                    ? '1 recent update'
                    : `${recentUpdatesCount} recent updates`}
                </span>
                <ChevronIcon className="-rotate-90 size-2 fill-secondary" />
              </a>
            )}
          </div>
        </div>
      </div>
      <SearchBarButton className="max-lg:hidden" label="Search projects" />
    </div>
  )
}

function ProjectSectionBreadcrumb({
  section,
  otherSections,
}: {
  section: ProjectSection
  otherSections?: ProjectSectionLink[]
}) {
  const { label, href, icon: Icon } = PROJECT_SECTIONS[section]
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-x-4 gap-y-1 font-bold text-2xs uppercase leading-none tracking-wide"
    >
      <a
        href={href}
        className="flex items-center gap-1.5 text-brand hover:underline"
      >
        <Icon className="size-3.5 stroke-brand" />
        {label}
      </a>
      {otherSections?.map((link) => (
        <a
          key={link.section}
          href={link.href}
          className="flex items-center gap-1.5 text-secondary hover:text-primary"
        >
          Also in {PROJECT_SECTIONS[link.section].label}
          <ChevronIcon className="-rotate-90 size-2 fill-current" />
        </a>
      ))}
    </nav>
  )
}
