'use client'

import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { partition } from 'lodash'
import Image from 'next/image'
import { useState } from 'react'
import { Tooltip, TooltipContent } from '~/components/core/tooltip/tooltip'

interface Props {
  projects: {
    name: string
    type: string
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
  const [secondGroupValue, setSecondGroupValue] = useState('')
  const [types, setTypes] = useState<string[]>(['layer2'])

  const secondGroupSlugs = secondGroupValue
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)

  const filteredProjects = projects.filter((project) => {
    if (!types.includes(project.type)) {
      return false
    }
    if (hideUpcoming && project.isUpcoming) {
      return false
    }
    if (hideArchived && project.isArchived) {
      return false
    }
    return true
  })
  const [firstGroup, secondGroup] = partition(
    filteredProjects,
    (project) => !secondGroupSlugs.includes(project.slug),
  )

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            value={types}
            multiple
            onChange={(e) => {
              setTypes(Array.from(e.target.selectedOptions).map((o) => o.value))
              throw new Error('Not implemented')
            }}
          >
            <option value="layer2">Layer 2s</option>
            <option value="layer3">Layer 3s</option>
            <option value="bridge">Bridges</option>
          </select>
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
          <span>Group 2 (Comma separated list of slugs)</span>
          <textarea
            className="bg-surface-secondary"
            value={secondGroupValue}
            onChange={(e) => setSecondGroupValue(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-1 bg-pure-white p-4">
        {firstGroup.map((project) => (
          <Tooltip key={project.slug}>
            <TooltipTrigger>
              <Image
                src={`/icons/${project.slug}.png`}
                alt={project.name}
                width={128}
                height={128}
                className="cursor-pointer"
                style={{ borderRadius, width: size, height: size }}
                onClick={() =>
                  setSecondGroupValue((exclude) => exclude + project.slug + ',')
                }
              />
            </TooltipTrigger>
            <TooltipContent>{project.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      {secondGroup.length !== 0 && (
        <div className="mt-6 flex flex-wrap gap-1 bg-pure-white p-4">
          {secondGroup.map((project) => (
            <Tooltip key={project.slug}>
              <TooltipTrigger>
                <Image
                  src={`/icons/${project.slug}.png`}
                  alt={project.name}
                  width={128}
                  height={128}
                  className="cursor-pointer"
                  style={{ borderRadius, width: size, height: size }}
                  onClick={() =>
                    setSecondGroupValue((exclude) => {
                      const slugs = exclude
                        .split(',')
                        .filter((s) => s.trim() !== project.slug)
                      return slugs.join(',')
                    })
                  }
                />
              </TooltipTrigger>
              <TooltipContent>{project.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  )
}
