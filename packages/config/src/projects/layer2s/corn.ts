import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'

const discovery = new ProjectDiscovery('corn')

export const corn: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1733880840),
  additionalPurposes: ['Bitcoin DApps'],
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Conduit],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Corn',
    slug: 'corn',
    category: 'Optimium',
    description:
      'Corn is an Orbit Stack-based Layer 2 focused on Bitcoin-centric DeFi applications. Corn uses Bitcorn (BTCN) as its gas token, the popCORN System for long-term incentives, and LayerZero for cross-chain asset transfers.',
    links: {
      websites: ['https://usecorn.com/'],
      apps: ['https://usecorn.com/app'],
      documentation: ['https://docs.usecorn.com/'],
      explorers: [
        'https://maizenet-explorer.usecorn.com/',
        'https://cornscan.io/',
      ],
      repositories: ['https://github.com/usecorn'],
      socialMedia: [
        'https://x.com/use_corn',
        'https://discord.com/invite/usecorn',
        'https://blog.usecorn.com/',
      ],
    },
  },
  rpcUrl: 'https://mainnet.corn-rpc.com',
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      // wbtc vault backing the BTCN in the canonical bridge
      address: EthereumAddress('0x00943b11764176C3a8323aEFCBd6fE70CFb6272d'),
      tokens: ['WBTC'],
      bridgedUsing: {
        bridges: [
          {
            name: 'LayerZero v2 OFT',
            slug: 'layerzerov2oft',
          },
        ],
      },
      source: 'external',
      description:
        "This vault escrows the WBTC backing BTCN, Corn's gastoken. Users can directly bridge via LayerZero when minting BTCN in this contract.",
    }),
    discovery.getEscrowDetails({
      // cbBTC vault backing the BTCN in the canonical bridge
      address: EthereumAddress('0x957c9dc25de6b8e46a7fa0d081ba749dd005b54f'),
      tokens: ['cbBTC'],
      bridgedUsing: {
        bridges: [
          {
            name: 'LayerZero v2 OFT',
            slug: 'layerzerov2oft',
          },
        ],
      },
      source: 'external',
      description:
        "This vault escrows the cbBTC backing BTCN, Corn's gastoken. Users can directly bridge via LayerZero when minting BTCN in this contract.",
    }),
  ],
  // gasTokens: ['BTCN'],
  // associatedTokens: ['BTCN'],
  discovery,
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'corn',
    chainId: 21000000,
    explorerUrl: 'https://maizenet-explorer.usecorn.com',
    explorerApi: {
      url: 'https://maizenet-explorer.usecorn.com/api',
      type: 'blockscout',
    },
    minTimestampForTvl: new UnixTime(1732012151),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 3228,
        version: '3',
      },
    ],
  },
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://blog.usecorn.com/corn-the-genesis-of-the-super-yield-network-f52170ffbe84',
      date: '2024-08-22T00:00:00Z',
      description: 'Corn launches its super yield network.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
