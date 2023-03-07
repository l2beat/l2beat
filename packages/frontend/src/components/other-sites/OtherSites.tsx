import React from 'react'

import { OutLink } from '../OutLink'

export function OtherSites() {
  return (
    <div
      className="
      mt-8 flex flex-col items-center justify-between
      rounded-xl bg-gradient-to-r from-purple-100/40
      via-pink-100/40
      to-red-200/40 px-10
      py-6 md:flex-row
    "
    >
      <div className="text-center text-lg font-semibold md:text-left">
        Ethereum Layer 1 is expensive. How much does it cost to use Layer 2? 💸
      </div>
      <OutLink
        className="
        mt-3 ml-0 min-w-[90px] text-center
        text-lg font-bold
        underline md:mt-0 md:ml-4"
        allowReferrer
        href="https://l2fees.info/"
      >
        Find out on L2 Fees
      </OutLink>
    </div>
  )
}
