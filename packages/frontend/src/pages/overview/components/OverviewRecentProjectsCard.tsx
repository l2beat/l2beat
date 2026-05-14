import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import type { OverviewRecentProject } from '../getOverviewData'

const CATEGORY_LABEL: Record<OverviewRecentProject['category'], string> = {
  scaling: 'Scaling project',
  da: 'Data Availability',
  zkCatalog: 'ZK Catalog',
  ecosystems: 'Ecosystem',
}

interface Props {
  projects: OverviewRecentProject[]
}

export function OverviewRecentProjectsCard({ projects }: Props) {
  const visibleProjects = projects.slice(0, 3)

  if (visibleProjects.length === 0) {
    return null
  }
  return (
    <PrimaryCard className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xl">Recently added projects</span>
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {visibleProjects.map((project) => (
          <li key={project.id}>
            <RecentProjectCard project={project} />
          </li>
        ))}
      </ul>
    </PrimaryCard>
  )
}

function RecentProjectCard({ project }: { project: OverviewRecentProject }) {
  const subtitle =
    project.category === 'scaling' && project.scalingCategory
      ? project.scalingCategory
      : CATEGORY_LABEL[project.category]
  return (
    <a
      href={project.href}
      className={cn(
        'group flex w-full items-center gap-2.5 rounded-lg border border-divider px-2.5 py-1.5',
        'transition-colors duration-200 hover:border-link-stroke hover:bg-surface-secondary',
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
