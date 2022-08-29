import React from 'react'

import { config } from '../../pages/config'
import { OutLink } from '../OutLink'

export function Banner() {
  if (!config.showBanner) {
    return null
  }
  return (
    <OutLink
      className="block text-center bg-[#7e41cc] text-white font-bold px-4 py-1 -mx-4 lg:mx-0 mb-4"
      href="https://gov.l2beat.com/"
    >
      L2Beat Governance forum is live!
    </OutLink>
  )
}
