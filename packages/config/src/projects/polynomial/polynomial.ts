import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('polynomial')

export const polynomial: ScalingProject = opStackL2({
  addedAt: UnixTime(1726570826), // 2024-09-17T11:00:26Z
  discovery,
  additionalBadges: [BADGES.RaaS.Conduit, BADGES.Infra.Superchain],
  additionalPurposes: ['Exchange'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Polynomial',
    slug: 'polynomial',
    description:
      'Polynomial Chain is a derivatives chain that addresses liquidity fragmentation with a unified liquidity layer, enabling innovative derivatives.',
    links: {
      websites: ['https://polynomial.fi/'],
      documentation: ['https://docs.polynomial.fi/'],
      explorers: ['https://polynomialscan.io/'],
      repositories: ['https://github.com/Polynomial-Protocol'],
      socialMedia: [
        'https://x.com/PolynomialFi',
        'https://discord.gg/Mr9XKU5W',
      ],
    },
  },
  chainConfig: {
    name: 'polynomial',
    chainId: 8008,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.polynomial.fi',
        callsPerMinute: 1500,
      },
    ],
  },
  isNodeAvailable: true,
  nodeSourceLink:
    'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
  stateDerivation: DERIVATION.OPSTACK('POLYNOMIAL'),
  genesisTimestamp: UnixTime(1718038307),
  milestones: [
    {
      title: 'Polynomial Chain announced',
      date: '2024-07-16T00:00:00.000Z',
      description: 'Polynomial Chain announced on X.',
      url: 'https://x.com/PolynomialFi/status/1813259120629457403',
      type: 'general',
    },
  ],
  nonTemplateEscrows: [
    {
      address: EthereumAddress('0x8309E63F777805f362d42f5B5f2D1A20287d5Df2'),
      sinceTimestamp: UnixTime(1751017763),
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
      address: EthereumAddress('0xEb3492A8A15baF729e57F4F7E84DC55B7A34A4e7'),
      sinceTimestamp: UnixTime(1748903783),
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
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc'),
      sinceTimestamp: UnixTime(1721219231),
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
    {
      address: EthereumAddress('0xDE1617Ddb7C8A250A409D986930001985cfad76F'),
      sinceTimestamp: UnixTime(1721277431),
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
      address: EthereumAddress('0xC6cfb996A7CFEB89813A68CD13942CD75553032b'),
      sinceTimestamp: UnixTime(1721382935),
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
      address: EthereumAddress('0xDf9Fa2b420689384E8DD55a706262DC0ED37020F'),
      sinceTimestamp: UnixTime(1728993695),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USD0++'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x1bF463463dd6747230Ee1bF9428376EBF1e2C23a'),
      sinceTimestamp: UnixTime(1732796447),
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
      address: EthereumAddress('0x572A4080c16beD33Cf2E876ad969E2E35769EDB4'),
      sinceTimestamp: UnixTime(1744192691),
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
      address: EthereumAddress('0x197cCb40bCDed89c3D7B891824ab44d1913Ee73E'),
      sinceTimestamp: UnixTime(1744193267),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['SolvBTC'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x847579e12CFb96a3357d9C51e374330af61716C2'),
      sinceTimestamp: UnixTime(1746458207),
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
      address: EthereumAddress('0xc374967634133F5Ed1DF5050276e5B33986625D3'),
      sinceTimestamp: UnixTime(1721232015),
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
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x2A905D69Cdb343B2e5F5E25a11788cDFb67d4E1d'),
      sinceTimestamp: UnixTime(1732794033),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['OP'],
      chain: 'optimism',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x2396843Ea97cf6b77239bB25fa018a3CD2ee06A6'),
      sinceTimestamp: UnixTime(1732796449),
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
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x31d16b451C4063FE24ca4149740aF10948FdE955'),
      sinceTimestamp: UnixTime(1733432921),
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
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x744E4E32c8b49bB0F812590a5124C183eD2Cd836'),
      sinceTimestamp: UnixTime(1744192681),
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
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0xaE3f9951fdC045E03Eb460D34B9728E327331Ccd'),
      sinceTimestamp: UnixTime(1746458201),
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
      chain: 'optimism',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x038bc0f438C6b46FaCc5C83475925F4Dc111d79F'),
      sinceTimestamp: UnixTime(1721231761),
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
      address: EthereumAddress('0xb4d1b0333Ba154ed42DECB07b0342C128bB492cf'),
      sinceTimestamp: UnixTime(1732796449),
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
      address: EthereumAddress('0xD08e20aAb70fE4aBC7f7BAA9d1A9BD02d6C6e883'),
      sinceTimestamp: UnixTime(1733432557),
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
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x33A1Ae6703362A0bcca814e3c1fC65Be0b8ccE61'),
      sinceTimestamp: UnixTime(1744192681),
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
    // {
    //   address: EthereumAddress('0xCAD78eA81c2323c83c897C374FC95E0ca853f2d2'),
    //   sinceTimestamp: UnixTime(1744193263),
    //   source: 'external',
    //   bridgedUsing: {
    //     bridges: [
    //       {
    //         name: 'Socket bridge',
    //         slug: 'socket',
    //       },
    //     ],
    //   },
    //   tokens: ['SolvBTC'],
    //   chain: 'base',
    //   includeInTotal: false,
    // },
    {
      address: EthereumAddress('0xae88be44e17BcB66A8640831a9AB6f973181df7C'),
      sinceTimestamp: UnixTime(1746458199),
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
      address: EthereumAddress('0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc'),
      sinceTimestamp: UnixTime(1721230760),
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
    // {
    //   address: EthereumAddress('0x2d4937ED79D434290c4baeA6d390b78c0bf907d8'),
    //   sinceTimestamp: UnixTime(1732791383),
    //   source: 'external',
    //   bridgedUsing: {
    //     bridges: [
    //       {
    //         name: 'Socket bridge',
    //         slug: 'socket',
    //       },
    //     ],
    //   },
    //   tokens: ['USD0++'],
    //   chain: 'arbitrum',
    //   includeInTotal: false,
    // },
    {
      address: EthereumAddress('0xBD9fB031dAC8FC48e7eB701DDEC90Cc194d5F4Db'),
      sinceTimestamp: UnixTime(1732796447),
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
      address: EthereumAddress('0x876fFa8AcBf043380675a579Eb1c67e8F097C045'),
      sinceTimestamp: UnixTime(1733432556),
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
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0xC3C20718050019fF79eB8961b2A38289dB8204B4'),
      sinceTimestamp: UnixTime(1744192680),
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
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x9f9D878bbd1118e7223f9d268d74fa6bdAf6CC52'),
      sinceTimestamp: UnixTime(1744193261),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['SolvBTC'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x66E4158A9341eF7950aF5B1435dcCf84FB8D6993'),
      sinceTimestamp: UnixTime(1746458198),
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
      includeInTotal: false,
    },
  ],
})
