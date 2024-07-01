import React from 'react'

import { usePageBuildContext } from '../../build/pageBuildContext'
import { PlainLink } from '../PlainLink'
import {
  DiscordIcon,
  GithubIcon,
  LinkedInIcon,
  MediumIcon,
  XIcon,
  YouTubeIcon,
} from '../icons'

export function SocialLinks() {
  const { config } = usePageBuildContext()
  return (
    <>
      <li>
        <PlainLink href={config.links.twitter} title="Twitter">
          <XIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.discord} title="Discord">
          <DiscordIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.github} title="Github">
          <GithubIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.linkedin} title="LinkedIn">
          <LinkedInIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.youTube} title="YouTube">
          <YouTubeIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.medium} title="Medium">
          <MediumIcon />
        </PlainLink>
      </li>
    </>
  )
}
