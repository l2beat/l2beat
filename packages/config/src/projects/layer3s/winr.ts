import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from '../layer3s'

export const winr: Layer3 = underReviewL3({
  hostChain: ProjectId('arbitrum'),
  id: ProjectId('winr'),
  display: {
    category: 'Optimium',
    provider: 'Arbitrum',
    name: 'WINR',
    slug: 'winr',
    description:
      'WINR is a Layer 3 on Arbitrum, based on the Orbit stack. It is focused on building a decentralized iGaming infrastructure.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://winr.games/'],
      apps: [],
      documentation: ['https://docs.winr.games/'],
      explorers: ['https://explorer.winr.games/'],
      repositories: [],
      socialMedia: ['https://x.com/WINRProtocol'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.winr.games ',
  associatedTokens: ['WINR'],
  escrows: [
    {
      chain: 'arbitrum',
      address: EthereumAddress('0xf3f01622ac969156760c32190995f9dc5b3eb7fa'), // ERC20Bridge
      sinceTimestamp: new UnixTime(1715799374),
      tokens: '*',
    },
    {
      // socket superbridge, converted with `yarn socket-convert` (https://github.com/WINRLabs/winr-token-bridge/blob/main/deployments/superbridge/prod_winr_prod_mainnet_addresses.json)
      address: EthereumAddress('0x8E83aED64a0Ad5d7d3A57B6172F14FcA5bfADE56'),
      sinceTimestamp: new UnixTime(1722608545),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDC.e'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x6aDFbA9e45b5c1685007Fe48A784e971e412f839'),
      sinceTimestamp: new UnixTime(1722608646),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDC'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x8b961A67f49bc6334CBA09dbd70a2F14Fc8226a1'),
      sinceTimestamp: new UnixTime(1722608661),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['WETH'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x88FA3A8624065f3Bf2eDe507b6Fd554C58e5b785'),
      sinceTimestamp: new UnixTime(1722608675),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wBTC'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x3222f0F281F1630C50f86fFaA29A29A06559eca8'),
      sinceTimestamp: new UnixTime(1722608690),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDT'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x0aE2F220cE9698b1c9853f7288aC882150291dca'),
      sinceTimestamp: new UnixTime(1722608704),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['ETH'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x023d27390aEd70aA39823A1e1e06a0b075400214'),
      sinceTimestamp: new UnixTime(1724262320),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['ARB'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
  ],
})
