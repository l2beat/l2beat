import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const zircuit: Layer2 = underReviewL2({
  id: 'zircuit',
  display: {
    name: 'Zircuit',
    slug: 'zircuit',
    description:
      'Zircuit is a universal ZK Rollup based on the Optimism Bedrock architecture, employing AI to identify and stop malicious transactions at the sequencer level.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://zircuit.com/'],
      apps: ['https://bridge.zircuit.com/'],
      documentation: ['https://docs.zircuit.com/'],
      explorers: ['https://explorer.zircuit.com/'],
      repositories: [],
      socialMedia: [
        'https://x.com/ZircuitL2',
        'https://discord.com/invite/zircuit',
        'https://zircuit.com/blog',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  escrows: [
    {
      chain: 'ethereum',
      address: EthereumAddress('0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1'), // OptimismPortal
      sinceTimestamp: new UnixTime(1719936491),
      tokens: ['ETH'],
    },
    {
      chain: 'ethereum',
      address: EthereumAddress('0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8'), // L1StandardBridge
      sinceTimestamp: new UnixTime(1719936539),
      tokens: '*', // will escrow ZRC (no priceData on CG yet)
    },
  ],
  rpcUrl: 'https://zircuit1-mainnet.p2pify.com/', // other: https://zircuit1-mainnet.liquify.com, https://zircuit-mainnet.drpc.org/
  // Chain ID: 48900
})
