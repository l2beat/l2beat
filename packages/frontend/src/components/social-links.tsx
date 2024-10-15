import { externalLinks } from '~/consts/external-links'

import { DiscordIcon } from '~/icons/products/discord'
import { GithubIcon } from '~/icons/products/github'
import { LinkedInIcon } from '~/icons/products/linkedin'
import { MediumIcon } from '~/icons/products/medium'
import { XIcon } from '~/icons/products/x'
import { YouTubeIcon } from '~/icons/products/youtube'
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
    <li key={title}>
      <a rel="noopener noreferrer" href={href} target="_blank">
        <Icon
          aria-label={title}
          className={cn(
            'size-6',
            variant === 'gray' &&
              'fill-zinc-500 transition-colors hover:fill-zinc-400 dark:fill-n-zinc-300 dark:hover:fill-zinc-400',
          )}
        />
      </a>
    </li>
  ))
}
