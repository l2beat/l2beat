import React from 'react'

interface Props {
  project: {
    name: string
    slug: string
  }
}

export function ProjectIconCell({ project }: Props) {
  return (
    <div className="size-[18px]">
      <img
        className="size-full"
        src={`/icons/${project.slug}.png`}
        alt={`${project.name} logo`}
      />
    </div>
  )
}
