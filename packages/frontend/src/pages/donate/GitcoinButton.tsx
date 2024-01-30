import React from 'react'

import { OutLink } from '../../components'

export function GitcoinButton() {
  return (
    <OutLink
      className="mx-auto mt-4 block max-w-[220px] rounded-md bg-[#048104] p-4 text-center font-bold text-white no-underline"
      href="https://gitcoin.co/grants/3857/l2beat"
    >
      Donate using Gitcoin
    </OutLink>
  )
}
