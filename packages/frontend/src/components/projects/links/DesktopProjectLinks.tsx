import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/components/core/NavigationMenu'
import { CustomLinkIcon } from '~/icons/Outlink'
import { SocialIcon } from '~/icons/products/SocialIcon'
import { cn } from '~/utils/cn'
import { formatLink } from '~/utils/formatLink'
import { DiscoUiLink } from './DiscoUiLink'
import { ProjectLinkIcon } from './ProjectLinkIcon'
import { parseSocial } from './parseSocial'
import type { ProjectLink } from './types'

interface Props {
  projectLinks: ProjectLink[]
  variant: 'primary' | 'header'
  discoUiHref?: string
}

export function DesktopProjectLinks({
  projectLinks,
  variant,
  discoUiHref,
}: Props) {
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
          {discoUiHref && <DiscoUiLink href={discoUiHref} />}
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}

function ProjectLinkItem({
  projectLink,
  variant,
}: {
  projectLink: ProjectLink
  variant: 'primary' | 'header'
}) {
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
            'ring-brand ring-inset focus:ring-2',
            'flex flex-row items-center gap-1.5',
          )}
        >
          <ProjectLinkIcon name={projectLink.name} />
          {projectLink.name}
          <CustomLinkIcon className="shrink-0 fill-current" />
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
          'ring-brand ring-inset focus:ring-2',
          variant === 'header' && 'bg-header-secondary',
        )}
      >
        <ProjectLinkIcon name={projectLink.name} />
        {projectLink.name}
      </NavigationMenuTrigger>
      <NavigationMenuContent
        className={cn(variant === 'header' && 'bg-header-secondary')}
      >
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
              <CustomLinkIcon className="shrink-0 fill-current" />
            </NavigationMenuLink>
          )
        })}
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
