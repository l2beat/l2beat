import type { UsedInProject } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectIconList } from './ProjectIconList'

export interface UsedInProjectWithIcon extends UsedInProject {
  icon: string
  url: string
}
interface Props {
  usedIn: UsedInProjectWithIcon[]
  className?: string
  noL2ClassName?: string
  maxProjects?: number
  noLink?: boolean
}

export function ProjectsUsedIn({
  usedIn,
  className,
  noL2ClassName,
  maxProjects = 5,
  noLink,
}: Props) {
  if (usedIn.length === 0) {
    return (
      <Tooltip>
        <TooltipTrigger className={noL2ClassName}>No L2 😔</TooltipTrigger>
        <TooltipContent>
          There are no scaling projects listed on L2BEAT that use this solution.
        </TooltipContent>
      </Tooltip>
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
      dialog={{
        title: 'Projects used in',
        description: 'Search for projects used in',
        searchPlaceholder: 'Start typing to find project...',
        emptyText: 'No projects found.',
      }}
      className={className}
      maxVisibleProjects={maxProjects}
      disableIconLinks={noLink}
    />
  )
}
