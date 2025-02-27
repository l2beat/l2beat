import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { BADGES } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const onchain: Layer3 = underReviewL3({
  id: 'onchain',
  capability: 'universal',
  addedAt: new UnixTime(1737469446), // 2025-01-21T14:24:03+00:00
  hostChain: ProjectId('base'),
  badges: [
    BADGES.RaaS.Conduit,
    BADGES.L3ParentChain.Base,
    BADGES.DA.DAC,
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
  ],
  display: {
    name: 'Onchain Chain',
    slug: 'onchain',
    category: 'Optimium',
    stack: 'Arbitrum',
    description:
      'Onchain Chain is an Orbit stack L3 with AnyTrust DA powering the ONCHAIN score system that evaluates addresses connected to a farcaster profile based on their onchain activity.',
    purposes: ['Gaming', 'Social'],
    links: {
      websites: ['https://onchaincoin.io/', 'https://portal.onchaincoin.io/'],
      apps: ['https://onchaingate.io/', 'https://t.me/onchaincoin_bot'],
      explorers: ['https://explorer.onchainpoints.xyz/'],
      socialMedia: [
        'https://x.com/onchaincoin',
        'https://warpcast.com/~/channel/onchaincoin',
        'https://t.me/onchaincoin_portal',
      ],
    },
  },
  chainConfig: {
    name: 'onchain',
    chainId: 17071,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.onchainpoints.xyz',
        callsPerMinute: 1500,
      },
    ],
  },
  escrows: [
    {
      address: EthereumAddress('0x2e5AfeEfeA725e23d0B54f9e28Fd9ACDD4c312E9'), // bridge (native token: POP)
      sinceTimestamp: new UnixTime(1718927985),
      tokens: ['ETH'],
      chain: 'base',
    },
    {
      address: EthereumAddress('0xbc201f1cfc02097f875ec45eb8d5f7b264EcA095'), // standardGW
      sinceTimestamp: new UnixTime(1718928173),
      tokens: '*',
      chain: 'base',
    },
  ],
})
