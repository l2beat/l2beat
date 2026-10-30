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
}

export function ProjectsUsedIn({ usedIn, className, emptyClassName }: Props) {
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
        href: project.url,
      }))}
      title="Used by"
      className={className}
    />
  )
}
