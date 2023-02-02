import React from 'react'

import { LinkSection as LinkSectionComponent } from './LinkSection'

export default {
  title: 'Components/Project/LinkSection',
}

export function LinkSection() {
  return (
    <div className="p-4 leading-normal">
      <LinkSectionComponent
        name="Arbitrum One"
        icon="/icons/arbitrum.png"
        links={{
          websites: ['https://arbitrum.io/', 'https://offchainlabs.com/'],
          apps: [],
          documentation: ['https://developer.offchainlabs.com/'],
          explorers: ['https://arbiscan.io', 'https://explorer.arbitrum.io/'],
          repositories: [
            'https://github.com/OffchainLabs/arbitrum',
            'https://github.com/OffchainLabs/arb-os',
          ],
          socialMedia: [
            'https://twitter.com/OffchainLabs',
            'https://twitter.com/arbitrum',
            'https://medium.com/offchainlabs',
            'https://discord.gg/5KE54JwyTs',
          ],
        }}
      />
    </div>
  )
}
