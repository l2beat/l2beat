import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('onyx')

export const onyx: ScalingProject = orbitStackL3({
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  discovery,
  capability: 'universal',
  addedAt: UnixTime(1744637831),
  hostChain: ProjectId('base'),
  additionalBadges: [BADGES.RaaS.Conduit],
  associatedTokens: ['XCN'],
  display: {
    name: 'Onyx',
    slug: 'onyx',
    description:
      'Onyx is a modular blockchain designed for financial-grade applications, offering near-instant confirmations and low fees.',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://onyx.org/'],
      repositories: ['https://github.com/Onyx-Protocol'],
      documentation: ['https://docs.onyx.org/'],
      explorers: ['https://explorer.onyx.org/'],
      bridges: ['https://app.onyx.org/', 'https://bridge.onyx.org/'],
      socialMedia: [
        'https://x.com/OnyxDAO',
        'https://t.me/Onyx',
        'https://blog.onyx.org/',
      ],
    },
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'onyx',
    gasTokens: ['XCN'],
    chainId: 80888,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.onyx.org',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'base:0x167D43d1D60DE2320B5E143F9c6a058092A913C2',
      ),
      tokens: '*',
    }),
  ],
})
