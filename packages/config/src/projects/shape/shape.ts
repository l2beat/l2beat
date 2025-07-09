import { UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('shape')

export const shape: ScalingProject = opStackL2({
  addedAt: UnixTime(1727654400), // 2024-09-30
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
      bridges: [
        'https://superbridge.app/shape-mainnet',
        'https://shape-mainnet.bridge.alchemy.com/',
      ],
      documentation: ['https://docs.shape.network/'],
      explorers: ['https://shapescan.xyz/'],
      repositories: ['https://github.com/shape-network'],
      socialMedia: [
        'https://x.com/Shape_L2',
        'https://discord.com/invite/shape-l2',
        'https://warpcast.com/shape-l2',
      ],
    },
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
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://www.alchemy.com/blog/shape-is-live',
      date: '2024-09-30T00:00:00Z',
      description: 'Shape Mainnet is now live.',
      type: 'general',
    },
  ],
})
