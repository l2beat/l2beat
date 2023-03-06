import React from 'react'

import { OutLink } from '../OutLink'

export function OtherSites() {
  return (
    <div className="
      flex flex-row justify-between items-center
      mt-[32px] px-[40px] py-[24px]
      rounded-[12px] 
      bg-gradient-to-r from-[#7E41CC99] via-[#FF46C099] to-[#EE2C0199]
      dark:from-purple-700 dark:to-purple-700
    ">
      <div className="flex flex-col justify-between text-white text-2xl">
        <span>Ethereum Layer 1 is expensive.</span>
        <span>How much does it cost to use Layer 2?</span>
      </div>
      <OutLink className="
        flex items-center 
        px-[48px] py-[19px]
        rounded-[8px]
        text-lg
        bg-white dark:bg-gradient-to-r from-[#7E41CC] to-[#FF46C0]"
        allowReferrer href="https://l2fees.info/">
        <span>
          Find out on L2 Fees
        </span>
      </OutLink>
    </div>
  )
}