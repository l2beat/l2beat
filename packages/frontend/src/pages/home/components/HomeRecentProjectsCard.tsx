import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import type { HomeRecentProject } from '../getHomeData'
import { HomeCard } from './HomeCard'

const VISIBLE_RECENT_PROJECTS_COUNT = 5

const CATEGORY_LABEL: Record<HomeRecentProject['category'], string> = {
  scaling: 'Scaling project',
  da: 'Data Availability',
  zkCatalog: 'ZK Catalog',
  ecosystems: 'Ecosystem',
}

interface Props {
  projects: HomeRecentProject[]
  className?: string
}

export function HomeRecentProjectsCard({ projects, className }: Props) {
  const visibleProjects = projects.slice(0, VISIBLE_RECENT_PROJECTS_COUNT)

  if (visibleProjects.length === 0) {
    return null
  }
  return (
    <HomeCard className={cn('flex h-full flex-col', className)}>
      <h2 className="font-bold text-xl">Recently added projects</h2>
      <ul className="mt-2 grid grid-cols-1 gap-1.5 md:grid-cols-3 xl:grid-cols-1">
        {visibleProjects.map((project) => (
          <li key={project.id}>
            <RecentProjectCard project={project} />
          </li>
        ))}
      </ul>
    </HomeCard>
  )
}

function RecentProjectCard({ project }: { project: HomeRecentProject }) {
  const subtitle =
    project.category === 'scaling' && project.scalingCategory
      ? project.scalingCategory
      : CATEGORY_LABEL[project.category]
  return (
    <a
      href={project.href}
      className={cn(
        'group flex w-full items-center gap-2.5 rounded-lg border border-divider px-2.5 py-1.5',
        'hover:bg-surface-secondary',
      )}
    >
      <img
        src={project.iconUrl}
        alt={project.name}
        className="size-7 shrink-0 rounded-full"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-bold text-label-value-14">
          {project.name}
        </span>
        <span className="flex items-center gap-1 truncate font-medium text-label-value-12 text-secondary">
          {subtitle}
        </span>
      </div>
      <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-colors group-hover:fill-link" />
    </a>
  )
}
