import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const clique: ScalingProject = underReviewL3({
  id: 'clique',
  capability: 'universal',
  addedAt: UnixTime(1726595996), // 2024-09-17T17:59:56Z
  archivedAt: UnixTime(1751896254), // 2025-07-07T13:50:54Z
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
    stacks: ['OP Stack'],
    description:
      'Clique is an OP stack Optimium built on Base and using Celestia for DA. The project aims to provide an environment that meets the needs of both onchain gaming and AI technologies. The team is also building their own onchain game called Eternal Legacy.',
    purposes: ['AI', 'Gaming'],
    links: {
      websites: ['https://clique.stp.network/'],
      bridges: ['https://bridge.myclique.io/', 'https://awns.stp.network/'],
      documentation: ['https://stpdao.gitbook.io/whitepaper'],
      explorers: ['https://explorer.myclique.io/'],
      repositories: ['https://github.com/STPDevteam/'],
      socialMedia: ['https://x.com/STP_Network', 'https://t.me/STPofficial'],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
  chainConfig: {
    name: 'clique',
    chainId: 8853,
    apis: [
      { type: 'rpc', url: 'https://rpc.myclique.io/', callsPerMinute: 300 },
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
      sinceTimestamp: UnixTime(1710831600),
      includeInTotal: false,
      tokens: ['ETH'],
      chain: 'base',
    },
  ],
})
