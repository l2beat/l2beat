import React from 'react'

interface Props {
  project: {
    name: string
    slug: string
  }
}

export function ProjectIconCell({ project }: Props) {
  return (
    <div className="relative h-[18px] w-[18px]">
      <img
        className="absolute h-full w-full"
        src={`/icons/${project.slug}.png`}
        alt={`${project.name} logo`}
      />
    </div>
  )
}
