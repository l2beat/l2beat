import React from 'react'

import { config } from '../config'
import { OutLink } from './OutLink'

export function SeasonalBanner() {
  if (!config.showSeasonalBanner) {
    return null
  }
  return (
    <OutLink className="SeasonalBanner" href="https://amsterdam.l2beat.com/">
      We&apos;re organizing Layer Two Amsterdam! Check it out!
    </OutLink>
  )
}
