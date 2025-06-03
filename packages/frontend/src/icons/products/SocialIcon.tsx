import type { JSX, SVGAttributes } from 'React'

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
  | './Discord'
  | './Github'
  | './Instagram'
  | './Linkedin'
  | 'medium'
  | './Reddit'
  | './Telegram'
  | './X'
  | './Youtube'
  | './Mirror'

interface Props extends SVGAttributes<SVGElement> {
  product: SocialIconType
}

export function SocialIcon({ product, ...props }: Props): JSX.Element {
  switch (product) {
    case './Discord':
      return <DiscordIcon {...props} />
    case './Github':
      return <GithubIcon {...props} />
    case './Instagram':
      return <InstagramIcon {...props} />
    case './Linkedin':
      return <LinkedInIcon {...props} />
    case 'medium':
      return <MediumIcon {...props} />
    case './Reddit':
      return <RedditIcon {...props} />
    case './Telegram':
      return <TelegramIcon {...props} />
    case './X':
      return <XIcon {...props} />
    case './Youtube':
      return <YouTubeIcon {...props} />
    case './Mirror':
      return <MirrorIcon {...props} />
  }
}
