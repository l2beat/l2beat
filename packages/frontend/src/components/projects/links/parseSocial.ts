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
      platform: './Discord',
      text: 'Discord',
    }
  }

  if (link.startsWith('twitter.com') || link.startsWith('x.com')) {
    return {
      platform: './X',
      text:
        '@' +
        (link.startsWith('x.com')
          ? link.slice('x.com/'.length)
          : link.slice('twitter.com/'.length)),
    }
  }

  if (link.startsWith('medium.com')) {
    return {
      platform: './Medium',
      text: link.slice('medium.com/'.length),
    }
  }

  if (link.endsWith('.medium.com')) {
    return {
      platform: './Medium',
      text: link.slice(0, -'.medium.com'.length),
    }
  }

  if (link.startsWith('youtube.com')) {
    return {
      platform: './Youtube',
      text: link.includes('/c/')
        ? link.slice('youtube.com/c/'.length)
        : 'youtube.com',
    }
  }

  if (link.startsWith('t.me')) {
    return {
      platform: './Telegram',
      text: link.slice('t.me/'.length),
    }
  }

  if (link.startsWith('reddit.com')) {
    return {
      platform: './Reddit',
      text: link.slice('reddit.com/'.length),
    }
  }

  if (link.startsWith('linkedin.com')) {
    return {
      platform: './Linkedin',
      text: link.slice('linkedin.com/company/'.length),
    }
  }

  if (link.startsWith('instagram.com')) {
    return {
      platform: './Instagram',
      text: link.slice('instagram.com/'.length),
    }
  }

  if (link === 'https://join.zksync.dev/' /* ONE-OFF HACK */)
    return {
      platform: './Discord',
      text: link,
    }

  if (link.endsWith('mirror.xyz')) {
    return {
      platform: './Mirror',
      text: 'Mirror',
    }
  }

  return { text: link }
}
