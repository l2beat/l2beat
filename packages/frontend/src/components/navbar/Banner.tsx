import React from 'react'

import { config } from '../../pages/config'
import { OutLink } from '../OutLink'

export function Banner() {
  if (!config.showBanner) {
    return null
  }
  return (
    <OutLink
      className="block text-center bg-[#0B4737] text-white text-opacity-70 text-sm font-bold px-4 py-1.5 -mx-4 lg:mx-0"
      href="https://twitter.com/VitalikButerin/status/1570306185391378434"
    >
      🎉 Ethereum 🐼 Merge is DONE! 🎉
    </OutLink>
  )
}
