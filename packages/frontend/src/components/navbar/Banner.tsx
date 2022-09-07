import React from 'react'

import { config } from '../../pages/config'
import { OutLink } from '../OutLink'

export function Banner() {
  if (!config.showBanner) {
    return null
  }
  return (
    <OutLink
      className="block text-center bg-[#048104] text-white font-bold px-4 py-1 -mx-4 lg:mx-0 mb-4"
      href="https://gitcoin.co/grants/3857/l2beat"
    >
      Gitcoin round 15 is live! Support L2BEAT by donating!
    </OutLink>
  )
}
