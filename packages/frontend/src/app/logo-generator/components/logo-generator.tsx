'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Props {
  projects: {
    name: string
    slug: string
    isUpcoming?: boolean
    isArchived?: boolean
  }[]
}

export function LogoGenerator({ projects }: Props) {
  const [size, setSize] = useState(32)
  const [borderRadius, setBorderRadius] = useState(0)
  const [hideUpcoming, setHideUpcoming] = useState(false)
  const [hideArchived, setHideArchived] = useState(false)
  const [include, setInclude] = useState('')
  const [exclude, setExclude] = useState('')

  const includedProjectSlugs = include
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)
  const excludedProjectSlugs = exclude
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)

  const toShow = projects.filter((project) => {
    if (hideUpcoming && project.isUpcoming) {
      return false
    }
    if (hideArchived && project.isArchived) {
      return false
    }
    if (
      includedProjectSlugs.length &&
      !includedProjectSlugs.includes(project.slug)
    ) {
      return false
    }
    if (excludedProjectSlugs.includes(project.slug)) {
      return false
    }
    return true
  })

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
      <div className="flex gap-4">
        <div className="flex gap-1.5">
          <input
            id="hide-upcoming"
            type="checkbox"
            checked={hideUpcoming}
            onChange={(e) => setHideUpcoming(e.target.checked)}
          />
          <label htmlFor="hide-upcoming">Hide upcoming</label>
        </div>
        <div className="flex gap-1.5">
          <input
            id="hide-archived"
            type="checkbox"
            checked={hideArchived}
            onChange={(e) => setHideArchived(e.target.checked)}
          />
          <label htmlFor="hide-archived">Hide archived</label>
        </div>
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
        <textarea
          className="bg-surface-secondary"
          value={include}
          onChange={(e) => setInclude(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <span>Exclude (Comma separated list of slugs to exclude)</span>
        <textarea
          className="bg-surface-secondary"
          value={exclude}
          onChange={(e) => setExclude(e.target.value)}
        />
      </div>
      <div className="mt-10 flex flex-wrap gap-1">
        {toShow.map((project) => (
          <Image
            key={project.slug}
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
