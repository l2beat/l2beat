import type { UsedInProject } from '@l2beat/config'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { LinkWithOnHoverPrefetch } from '~/components/link/link-with-on-hover-prefetch'
import { cn } from '~/utils/cn'

interface Props {
  usedIn: UsedInProject[]
  className?: string
  maxProjects?: number
  noTooltip?: boolean
  noLink?: boolean
}

export function ProjectsUsedIn({
  usedIn,
  className,
  maxProjects = 5,
  noTooltip,
  noLink,
}: Props) {
  if (usedIn.length === 0) {
    return (
      <Tooltip>
        <TooltipTrigger>No L2 😔</TooltipTrigger>
        <TooltipContent>
          There are no scaling projects listed on L2BEAT that use this solution.
        </TooltipContent>
      </Tooltip>
    )
  }

  const cappedProjects = usedIn.slice(0, maxProjects)

  const rest = usedIn.slice(maxProjects)

  const nMoreComponent = noTooltip ? (
    <span className="text-2xs text-zinc-800 dark:text-gray-50">
      +{rest.length} more
    </span>
  ) : (
    <Tooltip>
      <TooltipTrigger>
        <span className="text-2xs leading-none text-zinc-800 dark:text-gray-50">
          +{rest.length} more
        </span>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col">
        {rest.map((project) => (
          <span key={project.slug}>{project.name}</span>
        ))}
      </TooltipContent>
    </Tooltip>
  )

  return (
    <div
      className={cn(
        'flex shrink-0 flex-row flex-nowrap items-center gap-1.5',
        className,
      )}
    >
      {cappedProjects.map((project) => {
        return (
          <Tooltip key={project.slug}>
            {noLink ? (
              <TooltipTrigger>
                <Image
                  width={20}
                  height={20}
                  src={`/icons/${project.slug}.png`}
                  alt={`${project.name} logo`}
                />
              </TooltipTrigger>
            ) : (
              <LinkWithOnHoverPrefetch
                href={`/scaling/projects/${project.slug}`}
                className="size-5"
              >
                <TooltipTrigger>
                  <Image
                    width={20}
                    height={20}
                    src={`/icons/${project.slug}.png`}
                    alt={`${project.name} logo`}
                  />
                </TooltipTrigger>
              </LinkWithOnHoverPrefetch>
            )}
            <TooltipContent>{project.name}</TooltipContent>
          </Tooltip>
        )
      })}
      {rest.length > 0 && nMoreComponent}
    </div>
  )
}
