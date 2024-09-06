'use client'
import OutlinkIcon from '~/icons/outlink.svg'
import { ProductIcon } from '~/icons/products/SocialIcon'
import { cn } from '~/utils/cn'
import { formatLink } from '~/utils/format-link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../../navigation-menu'
import { parseSocial } from './parse-social'
import { ProjectLinkIcon } from './project-link-icon'
import { type ProjectLink } from './types'

interface Props {
  projectLinks: ProjectLink[]
}

export function DesktopProjectLinks({ projectLinks }: Props) {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          {projectLinks.map((link) => (
            <ProjectLinkItem key={link.name} projectLink={link} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

function ProjectLinkItem({ projectLink }: { projectLink: ProjectLink }) {
  if (projectLink.links.length === 1 && projectLink.name !== 'Social') {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink
          href={projectLink.links[0]}
          rel="noopener noreferrer"
          target="_blank"
          className={cn(
            navigationMenuTriggerStyle(),
            'flex flex-row items-center gap-1.5',
          )}
        >
          <ProjectLinkIcon name={projectLink.name} />
          {projectLink.name}
          <OutlinkIcon className="size-4 fill-current" />
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  }

  return <MultiProjectLink projectLink={projectLink} />
}

function MultiProjectLink({ projectLink }: { projectLink: ProjectLink }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        <ProjectLinkIcon name={projectLink.name} />
        {projectLink.name}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        {projectLink.links.map((link) => {
          const parsedSocial =
            projectLink.name === 'Social' ? parseSocial(link) : undefined
          return (
            <NavigationMenuLink
              key={link}
              href={link}
              rel="noopener noreferrer"
              target="_blank"
              className={cn(
                navigationMenuTriggerStyle(),
                'flex w-full justify-start gap-1.5',
              )}
            >
              {parsedSocial?.platform && (
                <ProductIcon
                  product={parsedSocial.platform}
                  width={16}
                  height={16}
                />
              )}
              {parsedSocial ? parsedSocial.text : formatLink(link)}
              <OutlinkIcon className="size-4 fill-current" />
            </NavigationMenuLink>
          )
        })}
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
