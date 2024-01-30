import React from 'react'

import { cn } from '../../utils/cn'

export interface ProjectSubPageHeaderProps {
  subPageName: string
  project: {
    name: string
    slug: string
  }
  className?: string
}

export function ProjectSubPageHeader(props: ProjectSubPageHeaderProps) {
  return (
    <div className={cn('flex items-center gap-1.5', props.className)}>
      <img
        className="size-4 md:size-4"
        src={`/icons/${props.project.slug}.png`}
        alt={`${props.project.name} logo`}
      />
      <h1 className="text-base font-medium">
        <a href={`/scaling/projects/${props.project.slug}`}>
          {props.project.name}
        </a>
        <span className="mx-1 text-gray-550">/</span>
        {props.subPageName}
      </h1>
    </div>
  )
}
