import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const ten: ScalingProject = upcomingL2({
  id: 'ten',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1705390051), // 2024-01-16T07:27:31Z
  display: {
    name: 'Ten',
    slug: 'ten',
    description:
      'Ten is an Encrypted Rollup that has been designed for use on the Ethereum network and uses 100% of the EVM. At present, Ten is available in testnet running on the Sepolia testnet for further testing and optimization.',
    purposes: ['Universal', 'Privacy'],
    links: {
      websites: ['https://ten.xyz'],
      documentation: [
        'https://docs.ten.xyz',
        'https://ten.xyz/litepaper',
        'https://whitepaper.ten.xyz',
      ],
      explorers: ['https://tenscan.io'],
      repositories: [
        'https://github.com/ten-protocol',
        'https://github.com/ten-protocol/go-ten',
        'https://github.com/ten-protocol/tutorial',
        'https://github.com/ten-protocol/sample-applications',
      ],
      socialMedia: [
        'https://twitter.com/tenprotocol',
        'https://discord.com/invite/tenprotocol',
        'https://t.me/tenprotocol',
        'https://medium.com/obscuro-labs',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
