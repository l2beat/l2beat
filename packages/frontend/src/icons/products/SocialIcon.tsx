import type { JSX, SVGAttributes } from 'react'

import { DiscordIcon } from './Discord'
import { GithubIcon } from './Github'
import { InstagramIcon } from './Instagram'
import { LinkedInIcon } from './Linkedin'
import { MediumIcon } from './Medium'
import { MirrorIcon } from './Mirror'
import { RedditIcon } from './Reddit'
import { TelegramIcon } from './Telegram'
import { XIcon } from './X'
import { YouTubeIcon } from './Youtube'

export type SocialIconType =
  | 'discord'
  | 'github'
  | 'instagram'
  | 'linked-in'
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
    case 'linked-in':
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
