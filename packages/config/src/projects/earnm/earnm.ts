import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('earnm')

export const earnm: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1761662460),
  hostChain: 'arbitrum',
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Alchemy],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Earnm',
    slug: 'earnm',
    description:
      'Earnm is a mobile-first Orbit stack L3 on Arbitrum that converts everyday mobile activity into cryptocurrency rewards through its EarnOS technology.',
    links: {
      websites: ['https://earnm.com/'],
      documentation: [],
      explorers: ['https://earnm-mainnet.explorer.alchemy.com/'],
      socialMedia: [
        'https://x.com/earnmrewards',
        'https://t.me/EARNMrewards',
        'https://discord.com/invite/earnm',
        'https://blog.earnm.com/',
      ],
      other: [
        'https://play.google.com/store/apps/details?id=us.current.android&hl=en',
      ],
      repositories: [],
    },
  },
  additionalPurposes: ['Social'],
  associatedTokens: ['EARNM'],
  chainConfig: {
    name: 'earnm',
    chainId: 32766,
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'rpc',
        url: 'https://earnm-mainnet.g.alchemy.com/public',
        callsPerMinute: 300,
      },
    ],
  },
  bridge: discovery.getContract('Bridge'),
  nonTemplateEscrows: [
    {
      address: EthereumAddress('0x0b6b5aFEe8602A4d88dC26Fc2E85b2d1236156F6'),
      sinceTimestamp: UnixTime(1745356800),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
})
