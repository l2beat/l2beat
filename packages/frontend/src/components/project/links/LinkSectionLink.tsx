import React from 'react'

import { formatLink } from '../../../utils/formatLink'
import {
  GlobeIcon,
  ProductIcon,
  ProductIconType,
  ProjectLink,
} from '../../icons'
import { Link } from '../../Link'

interface Props {
  name: ProjectLink['name']
  href: string
}

export function LinkSectionLink({ href, name }: Props) {
  if (name === 'Social') {
    const parsed = parseSocial(href)
    return (
      <Link className="mt-1 block first:mt-0" href={href}>
        {parsed.platform ? (
          <ProductIcon
            className="h-[1em] w-[1em] shrink-0 fill-current"
            product={parsed.platform}
          />
        ) : (
          <GlobeIcon className="h-[1em] w-[1em] shrink-0 fill-current" />
        )}
        <span className="truncate">{parsed.text}</span>
      </Link>
    )
  }
  return (
    <Link className="block truncate" href={href}>
      {formatLink(href)}
    </Link>
  )
}

interface SocialDetails {
  platform?: ProductIconType
  text: string
}

export function parseSocial(href: string): SocialDetails {
  const link = formatLink(href)
  if (link.startsWith('discord.gg')) {
    return {
      platform: 'discord',
      text: 'discord.gg',
    }
  } else if (link.startsWith('twitter.com')) {
    return {
      platform: 'twitter',
      text: '@' + link.slice('twitter.com/'.length),
    }
  } else if (link.startsWith('medium.com')) {
    return {
      platform: 'medium',
      text: link.slice('medium.com/'.length),
    }
  } else if (link.endsWith('.medium.com')) {
    return {
      platform: 'medium',
      text: link.slice(0, -'.medium.com'.length),
    }
  } else if (link.startsWith('youtube.com')) {
    return {
      platform: 'youtube',
      text: link.includes('/c/')
        ? link.slice('youtube.com/c/'.length)
        : 'youtube.com',
    }
  } else if (link.startsWith('t.me')) {
    return {
      platform: 'telegram',
      text: link.slice('t.me/'.length),
    }
  } else if (link.startsWith('reddit.com')) {
    return {
      platform: 'reddit',
      text: link.slice('reddit.com/'.length),
    }
  } else if (link.startsWith('linkedin.com')) {
    return {
      platform: 'linkedin',
      text: link.slice('linkedin.com/company/'.length),
    }
  } else if (link.startsWith('instagram.com')) {
    return {
      platform: 'instagram',
      text: link.slice('instagram.com/'.length),
    }
  } else if (link === 'https://join.zksync.dev/' /* ONE-OFF HACK */)
    return {
      platform: 'discord',
      text: link,
    }

  return { text: link }
}
