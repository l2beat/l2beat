import React from 'react'

import { OutLink } from '../OutLink'

export function OtherSites() {
  return (
    <div
      className="
      mt-[32px] flex flex-row items-center
      justify-between rounded-[12px] bg-gradient-to-r
      from-[#7E41CC99] 
      via-[#FF46C099] to-[#EE2C0199] px-[40px] py-[24px]
      dark:from-purple-700 dark:to-purple-700
    "
    >
      <div className="flex flex-col justify-between text-2xl text-white">
        <span>Ethereum Layer 1 is expensive.</span>
        <span>How much does it cost to use Layer 2?</span>
      </div>
      <OutLink
        className="
        flex items-center 
        rounded-[8px] bg-white
        from-[#7E41CC]
        to-[#FF46C0]
        px-[48px] py-[19px] text-lg dark:bg-gradient-to-r"
        allowReferrer
        href="https://l2fees.info/"
      >
        <span>Find out on L2 Fees</span>
      </OutLink>
    </div>
  )
}
