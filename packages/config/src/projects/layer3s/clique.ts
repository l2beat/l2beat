import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../internalTypes'
import { BADGES } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const clique: Layer3 = underReviewL3({
  id: 'clique',
  capability: 'universal',
  addedAt: new UnixTime(1726595996), // 2024-09-17T17:59:56Z
  hostChain: ProjectId('base'),
  badges: [
    BADGES.L3ParentChain.Base,
    BADGES.DA.Celestia,
    BADGES.Stack.OPStack,
    BADGES.VM.EVM,
    BADGES.RaaS.Conduit,
  ],
  display: {
    name: 'Clique',
    slug: 'clique',
    category: 'Optimium',
    stack: 'OP Stack',
    description:
      'Clique is an OP stack Optimium built on Base and using Celestia for DA. The project aims to provide an environment that meets the needs of both onchain gaming and AI technologies. The team is also building their own onchain game called Eternal Legacy.',
    purposes: ['AI', 'Gaming'],
    links: {
      websites: ['https://clique.stp.network/'],
      apps: ['https://bridge.myclique.io/', 'https://awns.stp.network/'],
      documentation: ['https://stpdao.gitbook.io/whitepaper'],
      explorers: ['https://explorer.myclique.io/'],
      repositories: ['https://github.com/STPDevteam/'],
      socialMedia: ['https://x.com/STP_Network', 'https://t.me/STPofficial'],
    },
  },
  chainConfig: {
    name: 'clique',
    chainId: 8853,
    apis: [
      { type: 'rpc', url: 'https://rpc.myclique.io/', callsPerMinute: 1500 },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    // BRIDGE
    {
      address: EthereumAddress('0x29e464a7e6331e80f0e707e2cbdbafb1a6af0a76'),
      sinceTimestamp: new UnixTime(1710831600),
      includeInTotal: false,
      tokens: ['ETH'],
      chain: 'base',
    },
  ],
})
