import React from 'react'

import { OutLink } from './OutLink'

export function OtherSites() {
  return (
    <div className="
      flex flex-row justify-between items-center
      mt-[32px] px-[40px] py-[24px]
      rounded-[12px] 
      dark:bg-gradient-to-r from-[#7E41CC] via-[#FF46C0] to-[#EE2C01] to-[#FF46C0] bg-purple-700
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
        dark:bg-gradient-to-r from-[#7E41CC] to-[#FF46C0] bg-white" 
      allowReferrer href="https://l2fees.info/">
        <span>
          Find out on L2 Fees
        </span>
      </OutLink>
    </div>
  )
}