import type { JSX, SVGAttributes } from 'react'

import { DiscordIcon } from './discord'
import { GithubIcon } from './github'
import { InstagramIcon } from './instagram'
import { LinkedInIcon } from './linkedin'
import { MediumIcon } from './medium'
import { MirrorIcon } from './mirror'
import { RedditIcon } from './reddit'
import { TelegramIcon } from './telegram'
import { XIcon } from './x'
import { YouTubeIcon } from './youtube'

export type SocialIconType =
  | 'discord'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'medium'
  | 'reddit'
  | 'telegram'
  | 'x'
  | 'youtube'
  | 'mirror'

interface Props extends SVGAttributes<SVGElement> {
  product: SocialIconType
}

export function SocialIcon({ product, ...props }: Props): JSX.Element {
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
    case 'mirror':
      return <MirrorIcon {...props} />
  }
}
