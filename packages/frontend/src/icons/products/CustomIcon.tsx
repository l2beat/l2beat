import type { JSX, SVGAttributes } from 'react'

import { DiscordIcon } from './Discord'
import { GithubIcon } from './Github'
import { GrowThePieIcon } from './GrowThePie'
import { InstagramIcon } from './Instagram'
import { LinkedInIcon } from './Linkedin'
import { MediumIcon } from './Medium'
import { MirrorIcon } from './Mirror'
import { RedditIcon } from './Reddit'
import { RollupCodesIcon } from './RollupCodes'
import { TelegramIcon } from './Telegram'
import { XIcon } from './X'
import { YouTubeIcon } from './Youtube'

export type CustomIconType =
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
  | 'growthepie'
  | 'rollup.codes'

interface Props extends SVGAttributes<SVGElement> {
  product: CustomIconType
}

export function CustomIcon({ product, ...props }: Props): JSX.Element {
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
    case 'growthepie':
      return <GrowThePieIcon {...props} />
    case 'rollup.codes':
      return <RollupCodesIcon {...props} />
  }
}
