'use client'

import { PlainLink } from '~/app/_components/plain-link'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/app/_components/popover'
import ChevronIcon from '~/icons/chevron.svg'
import OutlinkIcon from '~/icons/outlink.svg'
import { formatLink } from '~/utils/format-link'
import { ProjectLinkIcon } from './project-link-icon'
import { type ProjectLink } from './types'
import { ProductIcon } from '~/icons/products/SocialIcon'
import { parseSocial } from './parse-social'

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
      <div className="flex cursor-pointer flex-row items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1.5 font-medium text-xs transition-colors dark:bg-zinc-900 dark:hover:bg-zinc-700 hover:bg-gray-200">
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
      <PopoverTrigger className="group dark:bg-zinc-900 bg-gray-100 data-[state=open]:bg-gray-200 dark:data-[state=open]:bg-zinc-700 text-xs font-medium">
        <ProjectLinkIcon name={projectLink.name} />
        {projectLink.name}{' '}
        <ChevronIcon className="fill-current transition-transform duration-200 ease-out group-data-[state=open]:-rotate-180" />
      </PopoverTrigger>
      <PopoverContent align="start" className="dark:bg-zinc-900 bg-gray-100">
        {projectLink.links.map((link) => {
          const parsedSocial =
            projectLink.name === 'Social' ? parseSocial(link) : undefined
          return (
            <PlainLink
              key={link}
              href={link}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-xs transition-colors dark:hover:bg-zinc-700 hover:bg-gray-200"
            >
              {parsedSocial?.platform && (
                <ProductIcon
                  product={parsedSocial.platform}
                  width={16}
                  height={16}
                />
              )}
              {parsedSocial ? parsedSocial.text : formatLink(link)}
              <OutlinkIcon className="fill-current" />
            </PlainLink>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
