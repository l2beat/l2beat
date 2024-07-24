import { externalLinks } from '~/consts/external-links'

import DiscordIcon from '~/icons/products/discord.svg'
import GithubIcon from '~/icons/products/github.svg'
import LinkedInIcon from '~/icons/products/linkedin.svg'
import MediumIcon from '~/icons/products/medium.svg'
import XIcon from '~/icons/products/x.svg'
import YouTubeIcon from '~/icons/products/youtube.svg'

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
        <Icon aria-label={title} />
      </a>
    </li>
  ))
}
