'use client'

import { PlainLink } from '~/app/_components/plain-link'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/app/_components/popover'
import { ProjectLinkIcon } from './project-link-icon'
import { type ProjectLink } from './types'
import OutlinkIcon from '~/icons/outlink.svg'
import ChevronIcon from '~/icons/chevron.svg'

interface Props {
  projectLinks: ProjectLink[]
}

export function DesktopProjectLinks({ projectLinks }: Props) {
  return (
    <div className="flex flex-row flex-wrap gap-1.5">
      {projectLinks.map((link) => (
        <ProjectLinkItem key={link.name} projectLink={link} />
      ))}
    </div>
  )
}

function ProjectLinkItem({ projectLink }: { projectLink: ProjectLink }) {
  if (projectLink.links.length === 1 && projectLink.name !== 'Social') {
    return (
      <div className="flex cursor-pointer flex-row items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1.5 font-medium text-xs transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-gray-200">
        <PlainLink
          href={projectLink.links[0]}
          className="flex flex-row items-center gap-1.5"
        >
          <ProjectLinkIcon name={projectLink.name} />
          {projectLink.name} <OutlinkIcon className="fill-current" />
        </PlainLink>
      </div>
    )
  }

  return <MultiProjectLink projectLink={projectLink} />
}

function MultiProjectLink({ projectLink }: { projectLink: ProjectLink }) {
  return (
    <Popover>
      <PopoverTrigger className="group dark:bg-zinc-800">
        <ProjectLinkIcon name={projectLink.name} />
        {projectLink.name}{' '}
        <ChevronIcon className="fill-current transition-transform duration-200 ease-out group-data-[state=open]:-rotate-180" />
      </PopoverTrigger>
      <PopoverContent align="start">
        {projectLink.links.map((link) => {
          return (
            <PlainLink
              key={link}
              href={link}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-xs transition-colors dark:hover:bg-zinc-700 hover:bg-gray-200"
            >
              {formatLink(link)} <OutlinkIcon className="fill-current" />
            </PlainLink>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

function formatLink(link: string) {
  if (link.startsWith('https://')) {
    link = link.slice('https://'.length)
  } else if (link.startsWith('http://')) {
    link = link.slice('http://'.length)
  }
  if (link.endsWith('/')) {
    link = link.slice(0, -1)
  }
  return link
}
