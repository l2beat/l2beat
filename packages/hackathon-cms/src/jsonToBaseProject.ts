import type { BaseProject } from './BaseProject'
import type { ProjectJSON } from './types'

export function jsonToBaseProject(_: ProjectJSON): BaseProject {
  return {
    id: 'arbitrum',
    addedAt: 0,
    name: 'Arbitrum',
    slug: 'arbitrum',
    shortName: undefined,
    badges: ["EVM", "WasmVM"],
    display: {
      description: "Arbitrum One is a general-purpose Optimistic Rollup built by Offchain Labs and governed by the Arbitrum DAO.",
      links: {
        websites: ['https://arbitrum.io/', 'https://arbitrum.foundation/'],
        apps: ['https://bridge.arbitrum.io'],
        documentation: [
          'https://docs.arbitrum.io',
          'https://docs.arbitrum.foundation/',
        ],
        explorers: [
          'https://arbiscan.io',
          'https://explorer.arbitrum.io/',
          'https://arbitrum.l2scan.co/',
        ],
        repositories: [
          'https://github.com/ArbitrumFoundation/docs',
          'https://github.com/ArbitrumFoundation/governance',
          'https://github.com/OffchainLabs/arbitrum',
          'https://github.com/OffchainLabs/nitro',
          'https://github.com/OffchainLabs/arb-os',
        ],
        socialMedia: [
          'https://twitter.com/arbitrum',
          'https://arbitrumfoundation.medium.com/',
          'https://discord.gg/Arbitrum',
          'https://youtube.com/@Arbitrum',
          'https://t.me/arbitrum',
        ],
        rollupCodes: 'https://rollup.codes/arbitrum-one',
      }
    }
  }
}
