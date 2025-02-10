import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('ethernity')

export const ethernity: Layer2 = opStackL2({
  addedAt: new UnixTime(1718182472), // 2024-06-12T08:54:32Z
  additionalBadges: [Badge.RaaS.Gelato],
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
  rpcUrl: 'https://mainnet.ethernitychain.io',
  genesisTimestamp: new UnixTime(1723547737),
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
