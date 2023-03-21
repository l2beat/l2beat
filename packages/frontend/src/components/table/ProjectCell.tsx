import React from 'react'

import { ShieldIcon } from '../icons'
import { UnverifiedIcon } from '../icons/symbols/UnverifiedIcon'

export interface ProjectCellProps {
  project: {
    name: string
    slug: string
    isVerified?: boolean
    warning?: string
  }
  highlightL2?: boolean
  type: 'layer2' | 'bridge'
}

export function ProjectCell({ project, type, highlightL2 }: ProjectCellProps) {
  return (
    <div>
      <span className="relative pl-8 group-hover:underline">
        <img
          className="absolute top-0 left-0 inline-block h-[18px] w-[18px]"
          src={`/icons/${project.slug}.png`}
          alt={`${project.name} logo`}
        />
        {highlightL2 && type === 'layer2' && (
          <div
            role="img"
            aria-label={type}
            className="absolute -bottom-1 left-2.5 rounded-sm bg-gray-800 px-0.5 text-3xs font-bold text-white dark:bg-gray-200 dark:text-black"
          >
            L2
          </div>
        )}
        <span className="text-base font-bold md:text-lg">{project.name}</span>
      </span>
      {project.isVerified === false && (
        <span className="pl-1.5">
          <span
            className="Tooltip inline-block"
            title="This project contains unverified contracts."
          >
            <UnverifiedIcon className="relative top-px h-4 w-4 fill-red-300" />
          </span>
        </span>
      )}
      {project.warning && (
        <span className="pl-1.5">
          <span className="Tooltip inline-block" title={project.warning}>
            <ShieldIcon className="relative top-px h-4 fill-yellow-700 dark:fill-yellow-300" />
          </span>
        </span>
      )}
    </div>
  )
}
