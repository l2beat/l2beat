import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('ethernity')

export const ethernity: ScalingProject = opStackL2({
  addedAt: UnixTime(1718182472), // 2024-06-12T08:54:32Z
  additionalBadges: [BADGES.RaaS.Gelato],
  additionalPurposes: ['AI'],
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Ethernity',
    slug: 'ethernity',
    description:
      'Ethernity is a Rollup on Ethereum leveraging the OP stack. With a primary focus on the entertainment sector, Ethernity Chain aims to cultivate a vibrant ecosystem of world-class applications where developers and users alike are directly rewarded for their contributions.',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://ethernity.io/'],
      apps: [
        'https://bridge.gelato.network/bridge/ethernity-mainnet',
        'https://app.ethernity.io/',
      ],
      documentation: ['https://docs.ethernity.io/'],
      explorers: ['https://ernscan.io/'],
      socialMedia: [
        'https://x.com/EthernityChain',
        'https://instagram.com/ethernity',
        'https://ethernitychain.medium.com/',
        'https://t.me/ethernitychain',
        'https://discord.com/invite/EthernityChain',
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
        callsPerMinute: 1500,
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
