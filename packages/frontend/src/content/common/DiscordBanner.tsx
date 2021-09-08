import React from 'react'

import { config } from '../config'
import { DiscordIcon } from './icons'
import { OutLink } from './OutLink'

export function DiscordBanner() {
  return (
    <OutLink className="DiscordBanner" href={config.discordLink}>
      <DiscordIcon />
      Click here to join our community Discord server!
      <DiscordIcon />
    </OutLink>
  )
}
