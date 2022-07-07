import React from 'react'

import { config } from '../config'
import { OutLink } from './OutLink'

export function SeasonalBanner() {
  if (!config.showSeasonalBanner) {
    return null
  }
  return (
    <OutLink className="SeasonalBanner" href="https://gov.l2beat.com/">
      L2Beat Governance forum is live!
    </OutLink>
  )
}
