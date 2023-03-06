import React from 'react'

import { OutLink } from '../OutLink'

export function OtherSites() {
  return (
    <div
      className="
      mt-8 flex flex-row items-center
      justify-between rounded-xl bg-gradient-to-r
      from-purple-100/40
      via-pink-100/40 to-red-200/40
      px-10 py-6
    "
    >
      <div className="flex flex-col justify-between text-lg text-white">
        <span>Ethereum Layer 1 is expensive. How much does it cost to use Layer 2? 💸</span>
      </div>
      <OutLink
        className="
        flex items-center min-w-[90px]
        ml-4 text-lg font-bold
        text-center self-center underline"
        allowReferrer
        href="https://l2fees.info/"
      >
        Find out on L2 Fees
      </OutLink>
    </div>
  )
}
