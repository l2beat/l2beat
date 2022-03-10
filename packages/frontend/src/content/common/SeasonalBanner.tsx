import React from 'react'

import { config } from '../config'
import { OutLink } from './OutLink'

export function SeasonalBanner() {
  if (!config.showSeasonalBanner) {
    return null
  }
  return (
    <OutLink
      className="SeasonalBanner"
      href="https://gitcoin.co/grants/3857/l2beat"
    >
      Donate to L2BEAT&apos;s Gitcoin grant. A new matching round has just
      started!
    </OutLink>
  )
}
