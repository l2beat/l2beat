import React from 'react'

import { formatLink } from '../../utils/formatLink'
import { HoverableDropdown } from '../HoverableDropdown'
import {
  OutLinkIcon,
  ProductIcon,
  ProjectLink,
  ProjectLinkIcon,
} from '../icons'
import { OutLink } from '../OutLink'
import { parseSocial } from '../project/links/LinkSectionLink'

interface LinkSectionProps {
  projectLinks: ProjectLink[]
}

export function DesktopProjectLinks(props: LinkSectionProps) {
  return (
    <div className="flex flex-row gap-1.5">
      {props.projectLinks.map((link) => {
        return <ProjectLinkItem key={link.name} projectLink={link} />
      })}
    </div>
  )
}

interface LinkSectionItemProps {
  projectLink: ProjectLink
}

function ProjectLinkItem({ projectLink }: LinkSectionItemProps) {
  if (projectLink.links.length === 1 && projectLink.name !== 'Social') {
    return (
      <div className="flex cursor-pointer flex-row items-center gap-1.5 rounded-lg bg-gray-100 py-1.5 px-2 text-xs font-medium transition-colors hover:bg-gray-50 dark:bg-neutral-700 dark:hover:bg-gray-750">
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
    <HoverableDropdown
      title={
        <>
          <ProjectLinkIcon name={projectLink.name} />
          {projectLink.name}
        </>
      }
    >
      {projectLink.links.map((link) => {
        const parsedSocial =
          projectLink.name === 'Social' ? parseSocial(link) : undefined
        return (
          <OutLink
            key={link}
            href={link}
            className="flex items-center gap-1.5 rounded-lg py-1.5 px-3 text-xs font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-750"
          >
            {parsedSocial?.platform && (
              <ProductIcon
                product={parsedSocial.platform}
                width={16}
                height={16}
              />
            )}
            {parsedSocial ? parsedSocial.text : formatLink(link)}{' '}
            <OutLinkIcon />
          </OutLink>
        )
      })}
    </HoverableDropdown>
  )
}
