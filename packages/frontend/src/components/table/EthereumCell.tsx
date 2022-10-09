import React from 'react'

interface EthereumCellProps {
  project: {
    slug: string
    name: string
  }
}

export function EthereumCell({ project }: EthereumCellProps) {
  return (
    <span className="relative pl-7">
      <img
        className="absolute left-0 top-0 block w-[18px] h-[18px]"
        src={`/icons/${project.slug}.png`}
        alt={`${project.name} logo`}
      />
      <span className="font-bold text-base md:text-lg">{project.name}</span>
    </span>
  )
}
