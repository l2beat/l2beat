import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('lyra')

export const lyra: Layer2 = opStackL2({
  addedAt: new UnixTime(1702978961), // 2023-12-19T09:42:41Z
  daProvider: CELESTIA_DA_PROVIDER,
  additionalBadges: [Badge.RaaS.Conduit],
  associatedTokens: ['LYRA'],
  additionalPurposes: ['Exchange'],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Derive',
    slug: 'derive',
    description:
      'Derive Chain is an L2 scaling solution built using OP Stack specially for the Derive protocol - a settlement protocol for spot, perpetuals, and options trading.',
    links: {
      websites: ['https://derive.xyz/'],
      apps: ['https://derive.xyz/options/eth'],
      documentation: ['https://docs.lyra.finance/'],
      explorers: ['https://explorer.derive.xyz/'],
      repositories: ['https://github.com/lyra-finance/v2-core'],
      socialMedia: [
        'https://x.com/derivexyz',
        'https://warpcast.com/lyra.eth',
        'https://discord.gg/Derive',
      ],
    },
  },
  rpcUrl: 'https://rpc.lyra.finance',
  genesisTimestamp: new UnixTime(1700022479),
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAACLkdk+ILapw=',
  },
  // stateDerivation: DERIVATION.OPSTACK('LYRA'),
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      title: 'Derive rebrand',
      url: 'https://x.com/derivexyz/status/1828607400116658227',
      date: '2024-08-28T00:00:00Z',
      description: 'Lyra is now called Derive.',
      type: 'general',
    },
    {
      title: 'Lyra V2 live on mainnet',
      url: 'https://x.com/lyrafinance/status/1735516929341980748',
      date: '2023-12-15T00:00:00Z',
      description: 'Lyra V2 launches on Mainnet.',
      type: 'general',
    },
    {
      title: 'Lyra switches to Celestia',
      url: 'https://x.com/lyrafinance/status/1750235026136965260',
      date: '2024-01-16T00:00:00.00Z',
      type: 'general',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Blobstream and Celestia Architecture',
      url: 'https://www.youtube.com/watch?v=cn_fN6pkakQ',
      thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
    },
  ],
  nonTemplateEscrows: [
    // manually added with `pnpm socket-convert` script and latest json: https://github.com/SocketDotTech/socket-plugs/blob/295ef847031ae5260361d67a5b15b9a44fe033f7/deployments/superbridge/prod_lyra_addresses.json
    {
      address: EthereumAddress('0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91'),
      sinceTimestamp: new UnixTime(1724140259),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['DAI'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142'),
      sinceTimestamp: new UnixTime(1724140379),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['sDAI'],
      chain: 'ethereum',
    },
    // socket superbridge contracts from https://github.com/SocketDotTech/socket-plugs/blob/main/deployments/superbridge/prod_lyra_addresses.json
    {
      address: EthereumAddress('0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d'),
      sinceTimestamp: new UnixTime(1700227943),
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
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e'),
      sinceTimestamp: new UnixTime(1705069895),
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
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab'),
      sinceTimestamp: new UnixTime(1705069499),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['WBTC'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x76624ff43D610F64177Bb9c194A2503642e9B803'),
      sinceTimestamp: new UnixTime(1725056027),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['LBTC'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5'),
      sinceTimestamp: new UnixTime(1727390399),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['eBTC'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x76624ff43D610F64177Bb9c194A2503642e9B803'),
      sinceTimestamp: new UnixTime(1727390367),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['cbBTC'],
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x4e798659b9846F1da7B6D6B5d09d581270aB6FEC'),
      sinceTimestamp: new UnixTime(1709518033),
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
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x3BcB0FF2D4B674784ac1c33bc85a047b5a726E71'),
      sinceTimestamp: new UnixTime(1724140527),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDe'],
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0xF982c812099d03AFFa0c8062aa1abcb584c23329'),
      sinceTimestamp: new UnixTime(1717674807),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['weETH'],
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0xBd282333710B9C7e33E8a37d027885A7C079Ae23'),
      sinceTimestamp: new UnixTime(1711532017),
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
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x2805B908a0F9CA58a2b3b7900341b4EBd0B994e9'),
      sinceTimestamp: new UnixTime(1709502861),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wstETH'],
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa'),
      sinceTimestamp: new UnixTime(1705566299),
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
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592'),
      sinceTimestamp: new UnixTime(1708294763),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['SNX'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3'),
      sinceTimestamp: new UnixTime(1709517155),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wstETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xDEf0bfBdf7530C75AB3C73f8d2F64d9eaA7aA98e'),
      sinceTimestamp: new UnixTime(1704715451),
      includeInTotal: false,
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
      chain: 'optimism',
    },
    {
      address: EthereumAddress('0xBb9CF28Bc1B41c5c7c76Ee1B2722C33eBB8fbD8C'),
      sinceTimestamp: new UnixTime(1704715597),
      includeInTotal: false,
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
      chain: 'optimism',
    },
    {
      address: EthereumAddress('0xdD4c717a69763176d8B7A687728e228597eAB86d'),
      sinceTimestamp: new UnixTime(1704715809),
      includeInTotal: false,
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
      chain: 'optimism',
    },
    {
      address: EthereumAddress('0xE5967877065f111a556850d8f05b8DaD88edCEc9'),
      sinceTimestamp: new UnixTime(1704715873),
      includeInTotal: false,
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
      chain: 'optimism',
    },
    {
      address: EthereumAddress('0x44343AE5e9319b61c9DaD7876919eFdB03241b02'),
      sinceTimestamp: new UnixTime(1705566299),
      includeInTotal: false,
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
      chain: 'optimism',
    },
    {
      address: EthereumAddress('0x8574CBC539c26Df9ec11bA283218268101ff10e1'),
      sinceTimestamp: new UnixTime(1708294759),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['SNX'],
      chain: 'optimism',
    },
    {
      address: EthereumAddress('0xAA8f9D05599F1a5d5929c40342c06a5Da063a4dE'),
      sinceTimestamp: new UnixTime(1709502863),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wstETH'],
      chain: 'optimism',
    },
    {
      address: EthereumAddress('0x5e027ad442e031424b5a2C0ad6f656662Be32882'),
      sinceTimestamp: new UnixTime(1704715450),
      includeInTotal: false,
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
    },
    {
      address: EthereumAddress('0xFB7B06538d837e4212D72E2A38e6c074F9076E0B'),
      sinceTimestamp: new UnixTime(1704715596),
      includeInTotal: false,
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
    },
    {
      address: EthereumAddress('0x8e9f58E6c206CB9C98aBb9F235E0f02D65dFc922'),
      sinceTimestamp: new UnixTime(1704715806),
      includeInTotal: false,
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
    },
    {
      address: EthereumAddress('0x3D20c6A2b719129af175E0ff7B1875DEb360896f'),
      sinceTimestamp: new UnixTime(1704715871),
      includeInTotal: false,
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
    },
    {
      address: EthereumAddress('0xb2Cb9aDA6e00118dA8E83a6A53dF1EC6331A60a6'),
      sinceTimestamp: new UnixTime(1705566298),
      includeInTotal: false,
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
    },
    {
      address: EthereumAddress('0x8574CBC539c26Df9ec11bA283218268101ff10e1'),
      sinceTimestamp: new UnixTime(1709502860),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['wstETH'],
      chain: 'arbitrum',
    },
    // more escrows from https://raw.githubusercontent.com/0xdomrom/socket-plugs/main/deployments/superbridge/prod_lyra_addresses.json
    {
      address: EthereumAddress('0x8180EcCC825b692ef65FF099a0A387743788bf78'),
      sinceTimestamp: new UnixTime(1715846411),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['weETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4'),
      sinceTimestamp: new UnixTime(1715855051),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['rswETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x35d4D9bc79B0a543934b1769304B90d752691caD'),
      sinceTimestamp: new UnixTime(1717724723),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['rsETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xE3E96892D30E0ee1a8131BAf87c891201F7137bf'),
      sinceTimestamp: new UnixTime(1719833675),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['sUSDe'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A'),
      sinceTimestamp: new UnixTime(1724140487),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDe'],
      chain: 'ethereum',
    },
    // {
    //     address: EthereumAddress('0x44ed9cE901B367B1EF9DDBD4974C82A514c50DEc'),
    //     sinceTimestamp: new UnixTime(1717724797),
    //     includeInTotal: false,
    //     source: 'external',
    //     bridge: {
    //         name: 'Socket bridge',
    //         slug: 'socket'
    //     },
    //     tokens: ['wrsETH'],
    //     chain: 'optimism'
    // },
    {
      address: EthereumAddress('0x5324c6d731a3d9D740e880929E2c952bA27408De'),
      sinceTimestamp: new UnixTime(1719833737),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['sUSDe'],
      chain: 'optimism',
    },
    // {
    //     address: EthereumAddress('0xF982c812099d03AFFa0c8062aa1abcb584c23329'),
    //     sinceTimestamp: new UnixTime(1717674807),
    //     includeInTotal: false,
    //     source: 'external',
    //     bridge: {
    //         name: 'Socket bridge',
    //         slug: 'socket'
    //     },
    //     tokens: ['weETH'],
    //     chain: 'base'
    // },
    // {
    //     address: EthereumAddress('0xC4Cb2F82A01dC896a4d423231E60d7B500252e19'),
    //     sinceTimestamp: new UnixTime(1717724775),
    //     includeInTotal: false,
    //     source: 'external',
    //     bridge: {
    //         name: 'Socket bridge',
    //         slug: 'socket'
    //     },
    //     tokens: ['rsETH'],
    //     chain: 'base'
    // },
    // {
    //     address: EthereumAddress('0xFE00C281729fa7E7AaB453690ed184284F51268C'),
    //     sinceTimestamp: new UnixTime(1719833717),
    //     includeInTotal: false,
    //     source: 'external',
    //     bridge: {
    //         name: 'Socket bridge',
    //         slug: 'socket'
    //     },
    //     tokens: ['sUSDe'],
    //     chain: 'base'
    // },
    {
      address: EthereumAddress('0x8574CBC539c26Df9ec11bA283218268101ff10e1'),
      sinceTimestamp: new UnixTime(1717674857),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['weETH.mode'],
      chain: 'mode',
    },
    {
      address: EthereumAddress('0xAA8f9D05599F1a5d5929c40342c06a5Da063a4dE'),
      sinceTimestamp: new UnixTime(1717724847),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['rsETH'],
      chain: 'mode',
    },
    {
      address: EthereumAddress('0xdE45E2bCCb99E0ed1a2876cFC51a71ca5e822641'),
      sinceTimestamp: new UnixTime(1719833783),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['sUSDe'],
      chain: 'mode',
    },
    {
      address: EthereumAddress('0x3FBFD80EF7591658d1D7DdEC067F413eFd6f985c'),
      sinceTimestamp: new UnixTime(1715846405),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['weETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x486936FB1CE805e8C46E71C69256e72f3f550d38'),
      sinceTimestamp: new UnixTime(1717724755),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['rsETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x3c143EA5eBaB50ad6D2B2d14FA719234d1d38F1b'),
      sinceTimestamp: new UnixTime(1719833706),
      includeInTotal: false,
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['sUSDe'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x5fAA613365331A5062F3A00126954b742aBEb2FF'),
      sinceTimestamp: new UnixTime(1724140518),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDe'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
    // {
    //     address: EthereumAddress('0x2805B908a0F9CA58a2b3b7900341b4EBd0B994e9'),
    //     sinceTimestamp: new UnixTime(),
    //     includeInTotal: false,
    //     source: 'external',
    //     bridge: {
    //         name: 'Socket bridge',
    //         slug: 'socket'
    //     },
    //     tokens: ['weETH'],
    //     chain: 'blast'
    // },
    // {
    //     address: EthereumAddress('0x28c9ddF9A3B29c2E6a561c1BC520954e5A33de5D'),
    //     sinceTimestamp: new UnixTime(),
    //     includeInTotal: false,
    //     source: 'external',
    //     bridge: {
    //         name: 'Socket bridge',
    //         slug: 'socket'
    //     },
    //     tokens: ['rsETH'],
    //     chain: 'blast'
    // },
    // {
    //     address: EthereumAddress('0x837808498206FBb5C758D79424Cc3DCAD5d9E873'),
    //     sinceTimestamp: new UnixTime(),
    //     includeInTotal: false,
    //     source: 'external',
    //     bridge: {
    //         name: 'Socket bridge',
    //         slug: 'socket'
    //     },
    //     tokens: ['sUSDe'],
    //     chain: 'blast'
    // }
  ],
  chainConfig: {
    name: 'lyra',
    chainId: 957,
    explorerUrl: 'https://explorer.lyra.finance',
    explorerApi: {
      url: 'https://explorer.lyra.finance/api',
      type: 'blockscout',
    },
    // ~ Timestamp of block number 0 on Lyra
    // https://explorer.lyra.finance/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-11-15T04:13:35Z')),
    multicallContracts: [
      {
        sinceBlock: 1935198,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
  },
})
