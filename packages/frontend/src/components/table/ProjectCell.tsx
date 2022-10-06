import { Layer2 } from '@l2beat/config'
import React from 'react'

import { OptimismIcon, StarkWareIcon, ZkSyncIcon } from '../icons'

export interface ProjectCellProps {
  project: {
    name: string
    slug: string
    provider?: Layer2['technology']['provider']
  }
  type: 'layer2' | 'bridge'
}

export function ProjectCell({ project, type }: ProjectCellProps) {
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
    </>
  )
}
