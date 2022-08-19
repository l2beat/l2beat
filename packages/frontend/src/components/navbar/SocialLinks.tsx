import React from 'react'

import { config } from '../../pages/config'
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
        <OutLink href={config.twitterLink} title="Twitter">
          <TwitterIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={config.discordLink} title="Discord">
          <DiscordIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={config.githubLink} title="Github">
          <GithubIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={config.youTubeLink} title="YouTube">
          <YouTubeIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={config.mediumLink} title="Medium">
          <MediumIcon />
        </OutLink>
      </li>
    </>
  )
}
