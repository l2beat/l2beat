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
  if (projects.length === 0) {
    return null
  }
  return (
    <PrimaryCard className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xl">Recently added projects</span>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {projects.map((project) => (
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
        'group flex items-center gap-3 rounded-lg border border-divider px-3 py-2.5',
        'transition-colors duration-200 hover:border-link-stroke hover:bg-surface-secondary',
      )}
    >
      <img
        src={project.iconUrl}
        alt={project.name}
        className="size-8 shrink-0 rounded-full"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-bold text-label-value-15">
          {project.name}
        </span>
        <span className="flex items-center gap-1 truncate font-medium text-label-value-12 text-secondary">
          {subtitle}
        </span>
        <span className="mt-0.5 flex items-center gap-1 font-medium text-link text-xs">
          View details
          <ChevronIcon className="-rotate-90 size-2 fill-current" />
        </span>
      </div>
    </a>
  )
}
