'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Props {
  projects: {
    name: string
    slug: string
  }[]
}
export function LogoGenerator({ projects }: Props) {
  const [size, setSize] = useState(32)
  const [borderRadius, setBorderRadius] = useState(0)

  const [include, setInclude] = useState('')
  const includedProjectSlugs = include?.split(',').map((slug) => slug.trim())

  const toShow =
    include !== ''
      ? projects.filter((project) =>
          includedProjectSlugs?.includes(project.slug),
        )
      : projects

  return (
    <div>
      <div className="flex flex-col">
        <span>Size {size}</span>
        <input
          type="range"
          min={16}
          max={128}
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-col">
        <span>Border radius {borderRadius}</span>
        <input
          type="range"
          min={0}
          max={128}
          value={borderRadius}
          onChange={(e) => setBorderRadius(parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-col">
        <span>
          Include (Comma separated list of slugs e.g.
          arbitrum,optimism,zksync-era)
        </span>
        <input
          type="text"
          value={include}
          onChange={(e) => setInclude(e.target.value)}
        />
      </div>
      <div className="mt-10 flex flex-wrap gap-1">
        {toShow.map((project) => (
          <Image
            key={project.name}
            src={`/icons/${project.slug}.png`}
            alt={project.name}
            width={size}
            height={size}
            style={{ borderRadius }}
          />
        ))}
      </div>
    </div>
  )
}
