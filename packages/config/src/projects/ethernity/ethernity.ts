import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('ethernity')

export const ethernity: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1718182472), // 2024-06-12T08:54:32Z
  additionalBadges: [BADGES.RaaS.Gelato],
  additionalPurposes: ['AI'],
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  isPartOfSuperchain: true,
  display: {
    name: 'Epic Chain',
    slug: 'epicchain',
    description:
      'Epic chain, previously Ethernity, is a low-cost Layer 2 solution on the Superchain, designed to bring global entertainment franchises onto the blockchain.',
    links: {
      websites: ['https://epicchain.io/'],
      bridges: [
        'https://swap.epicchain.io/',
        'https://bridge.gelato.network/bridge/ethernity-mainnet',
      ],
      explorers: ['https://explorer.epicchain.io/'],
      documentation: [],
      repositories: ['https://github.com/epiconchain'],
      socialMedia: [
        'https://x.com/EpicOnChain',
        'https://t.me/epiconchain',
        'https://instagram.com/epiconchain/',
        'https://facebook.com/EpicOnChain',
      ],
    },
  },
  associatedTokens: ['ERN'],
  isNodeAvailable: true,
  chainConfig: {
    name: 'ethernity',
    chainId: 183,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.ethernitychain.io',
        callsPerMinute: 300,
      },
    ],
  },
  genesisTimestamp: UnixTime(1723547737),
  milestones: [
    // {
    //   name: 'Ethernity Mainnet Launch',
    //   link: 'https://debank.com/stream/2539393',
    //   date: '2024-07-19T00:00:00Z',
    //   description: 'Ethernity mainnet is open for users.',
    //   type: 'general',
    // },
    {
      title: 'Ethernity Permissioned Mainnet',
      url: 'https://www.ethernity.io/blog/the-ethernity-mainnet-launch-is-approaching',
      date: '2024-10-29T00:00:00Z',
      description:
        'Ethernity is accessible to early development partners and flagship apps.',
      type: 'general',
    },
  ],
})
