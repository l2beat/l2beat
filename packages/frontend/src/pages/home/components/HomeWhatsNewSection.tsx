import { pluralize } from '@l2beat/shared-pure'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import type { HomeRecentProject } from '../getHomeData'
import { HOME_ICON_CLASS, HOME_TEXT } from '../homeStyles'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'
import { HomeStackedIcons } from './HomeStackedIcons'
import { RecentChangesDialog } from './RecentChangesDialog'

export interface HomeRecentChangesProject {
  name: string
  iconUrl: string
}

const CATEGORY_LABEL: Record<HomeRecentProject['category'], string> = {
  l2: 'Scaling project',
  da: 'Data Availability',
  interop: 'Interoperability',
  zkCatalog: 'ZK Catalog',
  ecosystems: 'Ecosystem',
  privacy: 'Privacy',
}

/** New projects, under Ethereum. */
export function HomeWhatsNewProjects({
  projects,
  className,
}: {
  projects: HomeRecentProject[]
  className?: string
}) {
  if (projects.length === 0) {
    return null
  }
  return (
    <HomeCard className={cn('flex flex-col gap-2', className)}>
      <HomeCardHeader title="New research" />
      <NewProjects projects={projects} />
    </HomeCard>
  )
}

/** Project changes of the last 7 days; opens the list of them. */
export function HomeProjectChangesSection({
  count,
  projects,
  className,
}: {
  count: number
  projects: HomeRecentChangesProject[]
  className?: string
}) {
  return (
    <HomeCard className={cn('flex flex-col gap-3', className)}>
      <HomeCardHeader title="Project changes" subtitle="Last 7 days" />
      <ProjectChanges count={count} projects={projects} />
    </HomeCard>
  )
}

function NewProjects({ projects }: { projects: HomeRecentProject[] }) {
  return (
    // Row height and lines as in the rankings.
    <ul className="flex flex-col divide-y divide-divider">
      {projects.map((project) => (
        <li key={project.id} className="flex min-h-10 w-full">
          <a
            href={project.href}
            className="group flex min-w-0 flex-1 items-center gap-2 py-2"
          >
            <img src={project.iconUrl} alt="" className={HOME_ICON_CLASS} />
            <span
              className={cn(
                'min-w-0 flex-1 truncate underline-offset-2 group-hover:underline',
                HOME_TEXT.row,
              )}
            >
              {project.name}
            </span>
            <span className={cn('shrink-0', HOME_TEXT.meta)}>
              {project.category === 'l2' && project.l2Category
                ? project.l2Category
                : CATEGORY_LABEL[project.category]}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function ProjectChanges({
  count,
  projects,
}: {
  count: number
  projects: HomeRecentChangesProject[]
}) {
  if (count === 0) {
    return <span className={HOME_TEXT.meta}>No changes this week</span>
  }
  return (
    <RecentChangesDialog
      trigger={
        <button
          type="button"
          className="group flex w-fit items-center gap-2 text-left"
        >
          <HomeStackedIcons items={projects} max={4} showRest={false} />
          <span
            className={cn(
              'underline-offset-2 group-hover:underline',
              HOME_TEXT.row,
            )}
          >
            {count} {pluralize(count, 'change')}
          </span>
          <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-[fill,translate] group-hover:translate-x-0.5 group-hover:fill-link" />
        </button>
      }
    />
  )
}
