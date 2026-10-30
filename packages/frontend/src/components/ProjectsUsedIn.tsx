import type { UsedInProject } from '@l2beat/config'
import { cn } from '~/utils/cn'
import { ProjectIconList } from './ProjectIconList'

export interface UsedInProjectWithIcon extends UsedInProject {
  icon: string
  url: string | undefined
}
interface Props {
  usedIn: UsedInProjectWithIcon[]
  className?: string
  emptyClassName?: string
  maxProjects?: number
  noLink?: boolean
}

export function ProjectsUsedIn({
  usedIn,
  className,
  emptyClassName,
  maxProjects = 5,
  noLink,
}: Props) {
  if (usedIn.length === 0) {
    return (
      <span className={cn('text-secondary', emptyClassName)}>
        Not used by any listed project
      </span>
    )
  }

  return (
    <ProjectIconList
      projects={usedIn.map((project) => ({
        id: project.id,
        name: project.name,
        iconUrl: project.icon,
        href: noLink ? undefined : project.url,
      }))}
      dialog={{
        title: 'Projects used in',
        description: 'Search for projects used in',
        searchPlaceholder: 'Start typing to find project...',
        emptyText: 'No projects found.',
      }}
      className={className}
      maxVisibleProjects={maxProjects}
    />
  )
}
