import React from 'react'

import { OutLink } from '../OutLink'

export function Banner() {
  return (
    <OutLink
      className="block text-center bg-[#048104] text-white text-sm font-bold px-4 py-1.5"
      href="https://gitcoin.co/grants/3857/l2beat"
    >
      Gitcoin round 15 is live! Support L2BEAT by donating!
    </OutLink>
  )
}
