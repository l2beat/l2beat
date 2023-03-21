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
          className="absolute left-0 top-0 block h-[18px] w-[18px]"
          src={`/icons/${project.slug}.png`}
          alt={`${project.name} logo`}
        />
        <span className="text-base font-bold md:text-lg">{project.name}</span>
      </span>
    </div>
  )
}
