import { UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('shape')

export const shape: Layer2 = opStackL2({
  addedAt: new UnixTime(1730131160), // 2024-10-28
  additionalBadges: [Badge.RaaS.Alchemy],
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Shape',
    slug: 'shape',
    description:
      "Shape is a Rollup on Ethereum based on the OP Stack. It is a chain for creators, innovating by giving creators 80% of the Sequencer fee as 'gasback'.",
    links: {
      websites: ['https://shape.network/'],
      apps: ['https://superbridge.app/shape-mainnet'],
      documentation: ['https://docs.shape.network/documentation/introduction'],
      explorers: ['https://shapescan.xyz/'],
      repositories: ['https://github.com/shape-network'],
      socialMedia: [
        'https://x.com/Shape_L2',
        'https://discord.com/invite/shape-l2',
        'https://warpcast.com/shape-l2',
      ],
    },
  },
  finality: {
    type: 'OPStack',
    minTimestamp: new UnixTime(1721744473),
    genesisTimestamp: new UnixTime(1721744473),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  isNodeAvailable: true,
  rpcUrl: 'https://mainnet.shape.network',
  genesisTimestamp: new UnixTime(1721744473),
  stateDerivation: DERIVATION.OPSTACK('SHAPE'),
})
