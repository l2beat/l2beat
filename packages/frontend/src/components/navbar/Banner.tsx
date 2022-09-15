import React from 'react'

import { config } from '../../pages/config'
import { OutLink } from '../OutLink'

export function Banner() {
  if (!config.showBanner) {
    return null
  }
  return (
    <OutLink
      className="block text-center bg-[#2a363b] text-white text-sm font-bold px-4 py-1.5"
      href="https://twitter.com/VitalikButerin/status/1570306185391378434"
    >
      🎉 Ethereum 🐼 Merge is DONE! 🎉
    </OutLink>
  )
}
