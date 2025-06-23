import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const patex: ScalingProject = upcomingL2({
  id: 'patex',
  capability: 'universal',
  addedAt: UnixTime(1707313169), // 2024-02-07T13:39:29Z
  display: {
    category: 'Optimistic Rollup',
    name: 'Patex Network',
    slug: 'patex',
    description:
      'Patex Network is an L2 focusing on Real World Assets, forked from the OP stack codebase.',
    purposes: ['RWA'],
    links: {
      websites: ['https://patex.io/network'],
      bridges: ['https://patex.io/cabinet/converter'],
      documentation: ['https://docs.patex.io/tech/patex-network'],
      explorers: ['https://patexscan.io/'],
      repositories: ['https://github.com/patex-ecosystem/patex-network'],
      socialMedia: [
        'https://x.com/patex_ecosystem',
        'https://t.me/cpatexeng',
        'https://discord.gg/ntjQYv9VAA',
        'https://youtube.com/channel/UCLmHyM6kZ5bViyh7my6ZkpA',
      ],
    },
  },
})
//for once it goes live again
//rpcUrl: 'https://rpc.patex.io/', //chainid 789
//  escrows: [
//   {
//      chain: 'ethereum',
//      address: EthereumAddress('0x0d6e11E2A3B2B3a245bf839c07D775983aCB787d'), // unverified
//      sinceTimestamp: UnixTime(1686211235),
//      tokens: ['ETH'],
//    },
