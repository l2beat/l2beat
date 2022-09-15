import React from 'react'

import { config } from '../../pages/config'
import { OutLink } from '../OutLink'

export function Banner() {
  if (!config.showBanner) {
    return null
  }
  return (
    <OutLink
      className="block text-center bg-[#2a363b] text-white font-bold px-4 py-1 -mx-4 lg:mx-0 mb-4"
      href="https://twitter.com/VitalikButerin/status/1570306185391378434"
    >
      🎉 Ethereum 🐼 Merge is DONE! 🎉
    </OutLink>
  )
}
