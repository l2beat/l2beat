import { Layer2 } from '@l2beat/config'
import React from 'react'

import {
  OptimismIcon,
  ShieldWarnIcon,
  StarkWareIcon,
  ZkSyncIcon,
} from '../icons'

export interface ProjectCellProps {
  project: {
    name: string
    slug: string
    provider?: Layer2['technology']['provider']
    warning?: string
  }
  highlightL2?: boolean
  type: 'layer2' | 'bridge'
}

export function ProjectCell({ project, type, highlightL2 }: ProjectCellProps) {
  const href =
    type === 'layer2'
      ? `/scaling/projects/${project.slug}`
      : `/bridges/projects/${project.slug}`

  const providerClassName = 'Tooltip relative inline-block h-4 w-4 ml-1'
  const providerIconClassName = 'absolute -top-0.5 left-0 w-4 h-4'

  return (
    <>
      <a className="relative pl-7 hover:underline" href={href}>
        <img
          className="absolute left-0 top-0 block w-[18px] h-[18px]"
          src={`/icons/${project.slug}.png`}
          alt={`${project.name} logo`}
        />
        {highlightL2 && type === 'layer2' && (
          <div
            role="img"
            aria-label={type}
            className="absolute -bottom-1 left-2.5 text-3xs font-bold px-0.5 rounded-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-black"
          >
            L2
          </div>
        )}
        <span className="font-bold text-base md:text-lg">{project.name}</span>
      </a>
      {project.provider === 'StarkEx' && (
        <span
          className={providerClassName}
          title="This project is built using StarkEx."
        >
          <StarkWareIcon className={providerIconClassName} />
        </span>
      )}
      {project.provider === 'Optimism' && (
        <span
          className={providerClassName}
          title="This project is based on Optimism's code base."
        >
          <OptimismIcon className={providerIconClassName} />
        </span>
      )}
      {project.provider === 'zkSync' && (
        <span
          className={providerClassName}
          title="This project is based on zkSync's code base."
        >
          <ZkSyncIcon className={providerIconClassName} />
        </span>
      )}
      {project.warning && (
        <span
          className="Tooltip relative inline-block w-6 h-6 ml-1"
          title={project.warning}
        >
          <ShieldWarnIcon className="absolute -top-0.5 left-0 fill-yellow-700 dark:fill-yellow-300" />
        </span>
      )}
    </>
  )
}
