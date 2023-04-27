import React from 'react'

import { formatLink } from '../../utils/formatLink'
import { HoverableDropdown } from '../HoverableDropdown'
import { OutLink } from '../OutLink'
import { OutLinkIcon, ProjectLink, ProjectLinkIcon } from '../icons'

interface LinkSectionProps {
  projectLinks: ProjectLink[]
}

export function LinkSection(props: LinkSectionProps) {
  return (
    <div className="flex flex-row gap-1.5">
      {props.projectLinks.map((link) => {
        return <LinkSectionItem key={link.name} projectLink={link} />
      })}
    </div>
  )
}

interface LinkSectionItemProps {
  projectLink: ProjectLink
}

function LinkSectionItem({ projectLink }: LinkSectionItemProps) {
  if (projectLink.links.length === 1) {
    return (
      <div className="group flex cursor-pointer flex-row items-center gap-1.5 rounded-lg bg-gray-100 py-1.5 px-2 text-xs font-medium dark:bg-neutral-700 dark:hover:bg-gray-750">
        <OutLink
          href={projectLink.links[0]}
          className="flex flex-row items-center gap-1.5"
        >
          <ProjectLinkIcon name={projectLink.name} />
          {projectLink.name} <OutLinkIcon />
        </OutLink>
      </div>
    )
  }

  return (
    <HoverableDropdown>
      <HoverableDropdown.Toggle>
        <ProjectLinkIcon name={projectLink.name} />
        {projectLink.name}
      </HoverableDropdown.Toggle>
      <HoverableDropdown.Menu className="flex flex-col">
        {projectLink.links.map((link) => {
          return (
            <OutLink
              key={link}
              href={link}
              className="flex items-center gap-1.5 rounded-lg py-1.5 px-3 text-xs font-medium transition-colors hover:bg-gray-750"
            >
              {formatLink(link)} <OutLinkIcon />
            </OutLink>
          )
        })}
      </HoverableDropdown.Menu>
    </HoverableDropdown>
  )
}
