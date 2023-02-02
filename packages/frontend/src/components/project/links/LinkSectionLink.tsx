import React from 'react'

import { GlobeIcon, ProductIcon, ProductIconType } from '../../icons'
import { OutLink } from '../../OutLink'

interface Props {
  href: string
  social?: boolean
}

export function LinkSectionLink({ href, social }: Props) {
  if (social) {
    const parsed = parseSocial(href)
    return (
      <OutLink
        className="mt-1 flex items-center gap-1 truncate text-link first:mt-0"
        href={href}
      >
        {parsed.platform ? (
          <ProductIcon
            className="h-[1em] w-[1em] fill-link"
            product={parsed.platform}
          />
        ) : (
          <GlobeIcon className="h-[1em] w-[1em] fill-link" />
        )}
        {parsed.text}
      </OutLink>
    )
  }
  return (
    <OutLink className="block truncate text-link underline" href={href}>
      {simplify(href)}
    </OutLink>
  )
}

interface SocialDetails {
  platform?: ProductIconType
  text: string
}

function parseSocial(href: string): SocialDetails {
  const link = simplify(href)
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
  }
  return { text: link }
}

function simplify(href: string) {
  if (href.startsWith('https://')) {
    href = href.slice('https://'.length)
  }
  if (href.endsWith('/')) {
    href = href.slice(0, -1)
  }
  return href
}
