import { assert } from '@l2beat/shared-pure'
import React from 'react'

import { formatLink } from '../../utils/formatLink'
import { HoverableDropdown } from '../HoverableDropdown'
import {
  OutLinkIcon,
  ProductIcon,
  ProjectLink,
  ProjectLinkIcon,
} from '../icons'
import { Link } from '../Link'
import { PlainLink } from '../PlainLink'
import { parseSocial } from '../project/links/LinkSectionLink'

interface LinkSectionProps {
  projectLinks: ProjectLink[]
}

export function DesktopProjectLinks(props: LinkSectionProps) {
  return (
    <div className="flex flex-row flex-wrap gap-1.5">
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
  if (
    projectLink.links.length === 1 &&
    projectLink.name !== 'Social' &&
    projectLink.name !== 'Changelog'
  ) {
    return (
      <div className="flex cursor-pointer flex-row items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1.5 text-xs font-medium transition-colors hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-700">
        <PlainLink
          href={projectLink.links[0]}
          className="flex flex-row items-center gap-1.5"
        >
          <ProjectLinkIcon name={projectLink.name} />
          {projectLink.name} <OutLinkIcon />
        </PlainLink>
      </div>
    )
  }

  if (projectLink.name === 'Changelog') {
    assert(projectLink.links.length === 1)
    return (
      <div className="flex cursor-pointer flex-row items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1.5 text-xs font-medium text-white transition-colors">
        <Link
          href={projectLink.links[0]}
          className="flex flex-row items-center gap-1.5"
          underline={false}
        >
          <ProjectLinkIcon name={projectLink.name} />
          <span className="text-white">{projectLink.name}</span>
        </Link>
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
          <PlainLink
            key={link}
            href={link}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700"
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
          </PlainLink>
        )
      })}
    </HoverableDropdown>
  )
}
