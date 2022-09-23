import { Layer2 } from '@l2beat/config'
import React from 'react'

import { OptimismIcon, StarkWareIcon, ZkSyncIcon } from './icons'

interface Props {
  project: {
    name: string
    slug: string
    provider?: Layer2['technology']['provider']
  }
  type: 'layer2' | 'bridge'
}

export function ProjectLink({ project, type }: Props) {
  const href =
    type === 'layer2'
      ? `/scaling/projects/${project.slug}`
      : `/bridges/projects/${project.slug}`
  return (
    <>
      <a className="ProjectLink" href={href}>
        <img
          className="ProjectLink-Icon"
          src={`/icons/${project.slug}.png`}
          alt={`${project.name} logo`}
        />
        {project.name}
      </a>
      {project.provider === 'StarkEx' && (
        <span
          className="ProjectLink-Provider Tooltip"
          title="This project is built using StarkEx."
        >
          <StarkWareIcon />
        </span>
      )}
      {project.provider === 'Optimism' && (
        <span
          className="ProjectLink-Provider Tooltip"
          title="This project is based on Optimism's code base."
        >
          <OptimismIcon />
        </span>
      )}
      {project.provider === 'zkSync' && (
        <span
          className="ProjectLink-Provider Tooltip"
          title="This project is based on zkSync's code base."
        >
          <ZkSyncIcon />
        </span>
      )}
    </>
  )
}
