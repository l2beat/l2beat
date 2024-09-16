import { type UsedInProject } from '@l2beat/config/build/src/projects/other/da-beat/types/UsedInProject'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { cn } from '~/utils/cn'

interface Props {
  usedIn: UsedInProject[]
  className?: string
}

export function ProjectsUsedIn({ usedIn, className }: Props) {
  return (
    <div className={cn('flex gap-1.5', className)}>
      {usedIn.map((project) => {
        return (
          <Tooltip key={project.slug}>
            <TooltipTrigger>
              <Image
                width={20}
                height={20}
                className="min-h-5 min-w-5"
                src={`/icons/${project.slug}.png`}
                alt={`${project.name} logo`}
              />
            </TooltipTrigger>
            <TooltipContent>{project.name}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
