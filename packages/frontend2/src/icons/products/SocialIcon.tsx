import React, { type SVGAttributes } from 'react'

import DiscordIcon from './discord.svg'
import GithubIcon from './github.svg'
import InstagramIcon from './instagram.svg'
import LinkedInIcon from './linkedin.svg'
import MediumIcon from './medium.svg'
import RedditIcon from './reddit.svg'
import TelegramIcon from './telegram.svg'
import XIcon from './x.svg'
import YouTubeIcon from './youtube.svg'

export type ProductIconType =
  | 'discord'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'medium'
  | 'reddit'
  | 'telegram'
  | 'x'
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
    case 'x':
      return <XIcon {...props} />
    case 'youtube':
      return <YouTubeIcon {...props} />
  }
}
