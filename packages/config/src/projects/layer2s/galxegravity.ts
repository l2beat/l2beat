import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'

const discovery = new ProjectDiscovery('galxegravity', 'ethereum')

export const galxegravity: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1719415787), // 2024-06-26T15:29:47Z
  discovery,
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Conduit],
  associatedTokens: ['G'],
  gasTokens: ['G'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Gravity',
    slug: 'galxegravity',
    description:
      'Gravity is an Optimium built on the Orbit stack. It features onchain questing and has its own gas token - G. Other Galxe products are aiming to integrate with the L2 and a future migration to an L1 of the same name is planned.',
    links: {
      websites: ['https://gravity.xyz'],
      apps: ['https://bridge.gravity.xyz/'],
      documentation: ['https://docs.gravity.xyz/'],
      explorers: ['https://gscan.xyz/', 'https://explorer.gravity.xyz/'],
      repositories: ['https://github.com/Galxe'],
      socialMedia: [
        'https://x.com/GravityChain',
        'https://discord.com/invite/GravityChain',
        'https://t.me/GravityChain',
      ],
    },
  },
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  rpcUrl: 'https://rpc.gravity.xyz',
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.gravity.xyz',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  chainConfig: {
    name: 'galxegravity',
    coingeckoPlatform: 'gravity-alpha',
    chainId: 1625,
    explorerUrl: 'https://gscan.xyz',
    explorerApi: {
      url: 'https://explorer.gravity.xyz/api',
      type: 'blockscout',
    },
    blockscoutV2ApiUrl: 'https://explorer.gravity.xyz/api/v2',
    minTimestampForTvl: new UnixTime(1716054191), // block 1 TS
    multicallContracts: [
      {
        sinceBlock: 52682,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
  },
  customDa: AnytrustDAC({ discovery }),
})
