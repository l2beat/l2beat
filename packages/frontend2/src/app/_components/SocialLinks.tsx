import { externalLinks } from '~/consts/external-links'

import TwitterIcon from '~/icons/products/twitter.svg'
import DiscordIcon from '~/icons/products/discord.svg'
import GithubIcon from '~/icons/products/github.svg'
import LinkedInIcon from '~/icons/products/linkedin.svg'
import YouTubeIcon from '~/icons/products/youtube.svg'
import MediumIcon from '~/icons/products/medium.svg'

export function SocialLinks() {
  const links = [
    {
      href: externalLinks.twitter,
      title: 'Twitter',
      icon: TwitterIcon,
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
