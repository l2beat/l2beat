import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { underReviewL2 } from '../../templates/underReview'

const discovery = new ProjectDiscovery('katana')

export const katana: ScalingProject = underReviewL2({
  id: ProjectId('katana'),
  capability: 'universal',
  addedAt: UnixTime(1749119953),
  display: {
    name: 'Katana',
    slug: 'katana',
    description:
      'Katana is a Layer 2 specializing on DeFi. Its unique architecture combines an OP stack base with Agglayer shared bridge interoperability and OP-Succinct SP1 validity proofs.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    stack: 'Agglayer CDK',
    links: {
      websites: ['https://katana.network/'],
      bridges: [
        'https://app.katana.network/krates?p=deposit',
        'https://app.turtle.club/campaigns/katana',
      ],
      explorers: ['https://explorer.katanarpc.com'],
      socialMedia: [
        'https://x.com/katana',
        'https://discord.com/invite/KatanaNetwork',
      ],
    },
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  chainConfig: {
    name: 'katana',
    chainId: 747474,
    explorerUrl: 'https://explorer.katanarpc.com',
    sinceTimestamp: UnixTime(1746742811),
    apis: [
      { type: 'rpc', url: 'https://rpc.katana.network', callsPerMinute: 1500 },
      { type: 'blockscout', url: 'https://explorer.katanarpc.com/api' },
    ],
  },
  escrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x7B5A0182E400b241b317e781a4e9dEdFc1429822'),
      tokens: ['USDC.pdkatana'],
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb'),
      tokens: ['USDT.pdkatana'],
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x92C82f5F771F6A44CfA09357DD0575B81BF5F728'),
      tokens: ['WBTC.pdkatana'],
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF'),
      tokens: ['WETH.pdkatana'],
    }),
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
})
