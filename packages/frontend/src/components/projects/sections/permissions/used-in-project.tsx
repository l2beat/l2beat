import type { ProjectId } from '@l2beat/shared-pure'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { LinkWithOnHoverPrefetch } from '~/components/link/link-with-on-hover-prefetch'

export interface UsedInProject {
  id: ProjectId
  name: string
  slug: string
  iconPath: string
  targetName: string
  hrefRoot: string
  type: 'implementation' | 'proxy' | 'permission'
}

export function UsedInProjectEntry({
  label,
  implementations,
}: { label: string; implementations: UsedInProject[] }) {
  return (
    <div className="mt-2 flex flex-row items-center">
      <p className="text-gray-850 dark:text-gray-400">
        <strong className="text-primary">{label}: </strong>
      </p>
      <div className="flex flex-row items-center">
        {implementations.map((project, i) => (
          <Tooltip key={i}>
            <TooltipTrigger disabledOnMobile>
              <LinkWithOnHoverPrefetch
                href={`/${project.hrefRoot}/projects/${project.slug}/#${project.targetName}`}
                className="size-5"
              >
                <Image
                  width={20}
                  height={20}
                  key={i}
                  src={project.iconPath}
                  alt="Project icon"
                  className="mx-1 inline"
                />
              </LinkWithOnHoverPrefetch>
            </TooltipTrigger>
            <TooltipContent>
              <div>{project.name}</div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
