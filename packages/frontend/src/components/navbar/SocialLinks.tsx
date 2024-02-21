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
import { PlainLink } from '../PlainLink'

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
        <PlainLink href={props.twitterLink} title="Twitter">
          <TwitterIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={props.discordLink} title="Discord">
          <DiscordIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={props.githubLink} title="Github">
          <GithubIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={props.linkedinLink} title="LinkedIn">
          <LinkedInIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={props.youTubeLink} title="YouTube">
          <YouTubeIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={props.mediumLink} title="Medium">
          <MediumIcon />
        </PlainLink>
      </li>
    </>
  )
}
