import type { ProjectId } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'

export interface UsedInProject {
  id: ProjectId
  name: string
  slug: string
  url: string
  icon: string
  targetName: string
  type: 'implementation' | 'proxy' | 'permission'
}

export function UsedInProjectEntry({
  label,
  implementations,
}: {
  label: string
  implementations: UsedInProject[]
}) {
  return (
    <div className="mt-2 flex flex-row items-center text-paragraph-15 md:text-paragraph-16">
      <div className="flex flex-row flex-wrap items-center">
        <strong className="whitespace-nowrap text-primary">{label}: </strong>
        {implementations.map((project, i) => (
          <Tooltip key={i}>
            <TooltipTrigger disabledOnMobile>
              <a
                href={`${project.url}#${project.targetName}`}
                className="size-5"
              >
                <img
                  width={20}
                  height={20}
                  key={i}
                  src={project.icon}
                  alt="Project icon"
                  className="mx-1 inline min-h-5 min-w-5"
                />
              </a>
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

/** An implementation shared by a project that also shares the proxy is listed under the proxy only. */
export function splitUsedInProjects(projects: UsedInProject[]) {
  const proxies = projects.filter((p) => p.type === 'proxy')
  const proxyIds = new Set(proxies.map((p) => p.id))
  return {
    proxies,
    implementations: projects.filter(
      (p) => p.type === 'implementation' && !proxyIds.has(p.id),
    ),
    permissions: projects.filter((p) => p.type === 'permission'),
  }
}
