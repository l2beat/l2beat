import React from 'react'

interface EthereumCellProps {
  project: {
    slug: string
    name: string
  }
}

export function EthereumCell({ project }: EthereumCellProps) {
  return (
    <div>
      <span className="relative pl-8">
        <img
          className="absolute top-0 left-0 block size-[18px]"
          src={`/icons/${project.slug}.png`}
          alt={`${project.name} logo`}
        />
        <span className="font-bold text-base md:text-lg">{project.name}</span>
      </span>
    </div>
  )
}
