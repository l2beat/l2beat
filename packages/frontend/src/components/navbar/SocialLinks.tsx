import React from 'react'

import { Config } from '../../build/config'
import {
  DiscordIcon,
  GithubIcon,
  LinkedInIcon,
  MediumIcon,
  TwitterIcon,
  YouTubeIcon,
} from '../icons'
import { OutLink } from '../OutLink'

export interface SocialLinksProps {
  twitterLink: string
  discordLink: string
  githubLink: string
  linkedinLink: string
  youTubeLink: string
  mediumLink: string
}

export function getSocialLinksProps(config: Config) {
  return {
    twitterLink: config.links.twitter,
    discordLink: config.links.discord,
    githubLink: config.links.github,
    linkedinLink: config.links.linkedin,
    youTubeLink: config.links.youTube,
    mediumLink: config.links.medium,
  }
}

export function SocialLinks(props: SocialLinksProps) {
  return (
    <>
      <li>
        <OutLink href={props.twitterLink} title="Twitter">
          <TwitterIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={props.discordLink} title="Discord">
          <DiscordIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={props.githubLink} title="Github">
          <GithubIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={props.linkedinLink} title="LinkedIn">
          <LinkedInIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={props.youTubeLink} title="YouTube">
          <YouTubeIcon />
        </OutLink>
      </li>
      <li>
        <OutLink href={props.mediumLink} title="Medium">
          <MediumIcon />
        </OutLink>
      </li>
    </>
  )
}
