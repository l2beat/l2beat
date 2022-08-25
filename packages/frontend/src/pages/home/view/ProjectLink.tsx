import { Project } from '@l2beat/config'
import React from 'react'

import {
  OptimismIcon,
  StarkWareIcon,
  ZkSyncIcon,
} from '../../../components/icons'

interface Props {
  project: {
    name: string
    slug: string
    provider?: Project['details']['provider']
  }
}

export function ProjectLink({ project }: Props) {
  return (
    <>
      <a className="ProjectLink" href={`/projects/${project.slug}`}>
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
