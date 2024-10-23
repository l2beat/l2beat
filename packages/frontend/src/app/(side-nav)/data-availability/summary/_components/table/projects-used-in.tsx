import { type UsedInProject } from '@l2beat/config/build/src/projects/other/da-beat/types/UsedInProject'
import Image from 'next/image'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { cn } from '~/utils/cn'

interface Props {
  usedIn: UsedInProject[]
  className?: string
  maxProjects?: number
}

export function ProjectsUsedIn({ usedIn, className, maxProjects = 5 }: Props) {
  if (usedIn.length === 0) {
    return <div className="text-sm font-medium">Nobody 😔</div>
  }

  const cappedProjects = usedIn.slice(0, maxProjects)

  const restCount = usedIn.slice(maxProjects).length

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {cappedProjects.map((project) => {
        return (
          <Tooltip key={project.slug}>
            <Link href={`/scaling/projects/${project.slug}`}>
              <TooltipTrigger>
                <Image
                  width={20}
                  height={20}
                  className="min-h-5 min-w-5"
                  src={`/icons/${project.slug}.png`}
                  alt={`${project.name} logo`}
                />
              </TooltipTrigger>
            </Link>
            <TooltipContent>{project.name}</TooltipContent>
          </Tooltip>
        )
      })}
      {!!restCount && (
        <span className="text-2xs text-zinc-800 dark:text-gray-50 md:ml-2">
          +{restCount} more
        </span>
      )}
    </div>
  )
}
