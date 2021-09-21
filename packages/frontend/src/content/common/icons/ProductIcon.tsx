import React, { SVGAttributes } from 'react'

import { DiscordIcon } from './products/DiscordIcon'
import { GithubIcon } from './products/GithubIcon'
import { InstagramIcon } from './products/InstagramIcon'
import { LinkedInIcon } from './products/LinkedInIcon'
import { MediumIcon } from './products/MediumIcon'
import { RedditIcon } from './products/RedditIcon'
import { TelegramIcon } from './products/TelegramIcon'
import { TwitterIcon } from './products/TwitterIcon'
import { YouTubeIcon } from './products/YouTubeIcon'

export type ProductIconType =
  | 'discord'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'medium'
  | 'reddit'
  | 'telegram'
  | 'twitter'
  | 'youtube'

interface Props extends SVGAttributes<SVGElement> {
  product: ProductIconType
}

export function ProductIcon({ product, ...props }: Props): JSX.Element {
  switch (product) {
    case 'discord':
      return <DiscordIcon {...props} />
    case 'github':
      return <GithubIcon {...props} />
    case 'instagram':
      return <InstagramIcon {...props} />
    case 'linkedin':
      return <LinkedInIcon {...props} />
    case 'medium':
      return <MediumIcon {...props} />
    case 'reddit':
      return <RedditIcon {...props} />
    case 'telegram':
      return <TelegramIcon {...props} />
    case 'twitter':
      return <TwitterIcon {...props} />
    case 'youtube':
      return <YouTubeIcon {...props} />
  }
}
