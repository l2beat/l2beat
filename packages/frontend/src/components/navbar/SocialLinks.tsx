import React from 'react'

import { config } from '../../build/config'
import {
  DiscordIcon,
  GithubIcon,
  MediumIcon,
  TwitterIcon,
  YouTubeIcon,
} from '../icons'
import { OutLink } from '../OutLink'

export function SocialLinks() {
  return (
    <>
      <li>
        <OutLink href={config.links.twitter} title="Twitter">
          <TwitterIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={config.links.discord} title="Discord">
          <DiscordIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={config.links.github} title="Github">
          <GithubIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={config.links.youTube} title="YouTube">
          <YouTubeIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={config.links.medium} title="Medium">
          <MediumIcon />
        </OutLink>
      </li>
    </>
  )
}
