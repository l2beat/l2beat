import React from 'react'

interface EthereumCellProps {
  project: {
    slug: string
    name: string
  }
}

export function EthereumCell(props: EthereumCellProps) {
  return (
    <>
      <div className="ProjectCell">
        <img
          className="ProjectCell-Icon"
          src={`/icons/${props.project.slug}.png`}
          alt={`${props.project.name} logo`}
        />
        {props.project.name}
      </div>
    </>
  )
}
