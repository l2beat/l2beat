import { externalLinks } from '~/consts/externalLinks'

import { DiscordIcon } from '~/icons/products/Discord'
import { GithubIcon } from '~/icons/products/Github'
import { LinkedInIcon } from '~/icons/products/Linkedin'
import { MediumIcon } from '~/icons/products/Medium'
import { XIcon } from '~/icons/products/X'
import { YouTubeIcon } from '~/icons/products/Youtube'
import { cn } from '~/utils/cn'

interface Props {
  variant?: 'gray'
}

export function SocialLinks({ variant }: Props) {
  const links = [
    {
      href: externalLinks.x,
      title: 'X',
      icon: XIcon,
    },
    {
      href: externalLinks.discord,
      title: 'Discord',
      icon: DiscordIcon,
    },
    {
      href: externalLinks.github,
      title: 'GitHub',
      icon: GithubIcon,
    },
    {
      href: externalLinks.linkedin,
      title: 'LinkedIn',
      icon: LinkedInIcon,
    },
    {
      href: externalLinks.youTube,
      title: 'YouTube',
      icon: YouTubeIcon,
    },
    {
      href: externalLinks.medium,
      title: 'Medium',
      icon: MediumIcon,
    },
  ]
  return links.map(({ href, title, icon: Icon }) => (
    <a key={title} rel="noopener noreferrer" href={href} target="_blank">
      <Icon
        aria-label={title}
        className={cn(
          'size-6',
          variant === 'gray' &&
            'fill-primary transition-colors hover:fill-secondary',
        )}
      />
    </a>
  ))
}
