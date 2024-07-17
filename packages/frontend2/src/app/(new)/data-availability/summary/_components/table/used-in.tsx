import Image from 'next/image'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { type UsedInProject } from '~/server/features/data-availability/utils/get-used-in-projects'

interface Props {
  usedIn: UsedInProject[]
}

export function UsedIn({ usedIn }: Props) {
  return (
    <div className="flex gap-1.5">
      {usedIn.map((project) => {
        return (
          <Tooltip key={project.slug}>
            <TooltipTrigger>
              <Link href={`/scaling/projects/${project.slug}`}>
                <Image
                  width={20}
                  height={20}
                  className="min-h-5 min-w-5"
                  src={`/icons/${project.slug}.png`}
                  alt={`${project.name} logo`}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent>{project.name}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
