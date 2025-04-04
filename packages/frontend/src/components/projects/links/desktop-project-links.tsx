'use client'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/components/core/navigation-menu'
import { CustomLinkIcon } from '~/icons/outlink'
import { SocialIcon } from '~/icons/products/social-icon'
import { cn } from '~/utils/cn'
import { formatLink } from '~/utils/format-link'
import { parseSocial } from './parse-social'
import { ProjectLinkIcon } from './project-link-icon'
import type { ProjectLink } from './types'

interface Props {
  projectLinks: ProjectLink[]
  variant: 'primary' | 'header'
}

export function DesktopProjectLinks({ projectLinks, variant }: Props) {
  return (
    <NavigationMenu asChild>
      <div>
        <NavigationMenuList>
          {projectLinks.map((link) => (
            <ProjectLinkItem
              key={link.name}
              projectLink={link}
              variant={variant}
            />
          ))}
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}

function ProjectLinkItem({
  projectLink,
  variant,
}: { projectLink: ProjectLink; variant: 'primary' | 'header' }) {
  if (projectLink.links.length === 1 && projectLink.name !== 'Social') {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink
          href={projectLink.links[0]}
          rel="noopener noreferrer"
          target="_blank"
          className={cn(
            navigationMenuTriggerStyle(),
            variant === 'header' && 'bg-header-secondary',
            'ring-inset ring-brand focus:ring-2',
            'flex flex-row items-center gap-1.5',
          )}
        >
          <ProjectLinkIcon name={projectLink.name} />
          {projectLink.name}
          <CustomLinkIcon className="fill-current" />
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  }

  return <MultiProjectLink projectLink={projectLink} variant={variant} />
}

function MultiProjectLink({
  projectLink,
  variant,
}: { projectLink: ProjectLink; variant: 'primary' | 'header' }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          'ring-inset ring-brand focus:ring-2',
          variant === 'header' && 'bg-header-secondary',
        )}
      >
        <ProjectLinkIcon name={projectLink.name} />
        {projectLink.name}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="space-y-1">
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
                variant === 'primary' &&
                  'bg-surface-primary hover:bg-surface-secondary focus:bg-surface-secondary',
                variant === 'header' &&
                  'bg-header-secondary hover:bg-surface-tertiary focus:bg-surface-tertiary',
                'flex w-full justify-start gap-1.5',
              )}
            >
              {parsedSocial?.platform && (
                <SocialIcon
                  product={parsedSocial.platform}
                  width={16}
                  height={16}
                />
              )}
              {parsedSocial ? parsedSocial.text : formatLink(link)}
              <CustomLinkIcon className="fill-current" />
            </NavigationMenuLink>
          )
        })}
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
