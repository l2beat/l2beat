import type { SocialIconType } from '~/icons/products/SocialIcon'
import { formatLink } from '~/utils/formatLink'

interface SocialDetails {
  platform?: SocialIconType
  text: string
}

export function parseSocial(href: string): SocialDetails {
  const link = formatLink(href)
  if (link.startsWith('discord.gg') || link.startsWith('discord.com/invite/')) {
    return {
      platform: 'discord',
      text: 'Discord',
    }
  }

  if (link.startsWith('twitter.com') || link.startsWith('x.com')) {
    return {
      platform: 'x',
      text:
        '@' +
        (link.startsWith('x.com')
          ? link.slice('x.com/'.length)
          : link.slice('twitter.com/'.length)),
    }
  }

  if (link.startsWith('medium.com')) {
    return {
      platform: 'medium',
      text: link.slice('medium.com/'.length),
    }
  }

  if (link.endsWith('.medium.com')) {
    return {
      platform: 'medium',
      text: link.slice(0, -'.medium.com'.length),
    }
  }

  if (link.startsWith('youtube.com')) {
    return {
      platform: 'youtube',
      text: link.includes('/c/')
        ? link.slice('youtube.com/c/'.length)
        : 'youtube.com',
    }
  }

  if (link.startsWith('t.me')) {
    return {
      platform: 'telegram',
      text: link.slice('t.me/'.length),
    }
  }

  if (link.startsWith('reddit.com')) {
    return {
      platform: 'reddit',
      text: link.slice('reddit.com/'.length),
    }
  }

  if (link.startsWith('linkedin.com')) {
    return {
      platform: 'linked-in',
      text: link.slice('linkedin.com/company/'.length),
    }
  }

  if (link.startsWith('instagram.com')) {
    return {
      platform: 'instagram',
      text: link.slice('instagram.com/'.length),
    }
  }

  if (link === 'https://join.zksync.dev/' /* ONE-OFF HACK */)
    return {
      platform: 'discord',
      text: link,
    }

  if (link.endsWith('mirror.xyz')) {
    return {
      platform: 'mirror',
      text: 'Mirror',
    }
  }

  return { text: link }
}
