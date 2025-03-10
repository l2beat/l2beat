import { UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'
import { BADGES } from '../badges'

const discovery = new ProjectDiscovery('shape')

export const shape: ScalingProject = opStackL2({
  addedAt: UnixTime(1730131160), // 2024-10-28
  additionalBadges: [BADGES.RaaS.Alchemy],
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
    minTimestamp: UnixTime(1721744473),
    genesisTimestamp: UnixTime(1721744473),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  isNodeAvailable: true,
  chainConfig: {
    name: 'shape',
    // TODO: known collision of shape and molten = 360. We should remove the uniqueness assumption!
    chainId: undefined,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.shape.network',
        callsPerMinute: 1500,
      },
    ],
  },
  genesisTimestamp: UnixTime(1721744473),
  stateDerivation: DERIVATION.OPSTACK('SHAPE'),
})
