import { externalLinks } from '~/consts/external-links'

import { DiscordIcon } from '~/icons/products/discord'
import { GithubIcon } from '~/icons/products/github'
import { LinkedInIcon } from '~/icons/products/linkedin'
import { MediumIcon } from '~/icons/products/medium'
import { XIcon } from '~/icons/products/x'
import { YouTubeIcon } from '~/icons/products/youtube'

export function SocialLinks() {
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
        <Icon aria-label={title} className="size-6" />
      </a>
    </li>
  ))
}
