import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../internalTypes'

export const mova: ScalingProject = {
  addedAt: UnixTime(1680782525),
  genesisTimestamp: UnixTime(1688314886),

  display: {
    name: 'MOVA',
    slug: 'mova',
    description:
      'MOVA is a quantum-resistant, institutional-grade modular blockchain designed for high-performance and scalable digital finance infrastructure. It provides a secure foundation for Web3 and PayFi ecosystems, enabling seamless integration and real-world adoption.',
    links: {
      websites: ['https://www.movachain.com/'],
      bridges: ['https://bridge.movachain.com/'],
      documentation: ['https://docs.movachain.com/'],
      explorers: ['https://explorer.movachain.com/'],
      repositories: ['https://github.com/MovaChain'],
      socialMedia: [
        'https://discord.gg/3rm3TUpxf',
        'https://x.com/MovaChain',
        'https://t.me/MovaChain',
      ],
    },
  },

  chainConfig: {
    name: 'mova',
    chainId: 61900,
    explorerUrl: 'https://explorer.movachain.com/',
    sinceTimestamp: UnixTime(1740000000),
    gasTokens: ['MOVA'],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.movachain.com',
        callsPerMinute: 300,
      },
    ],
  },
}
