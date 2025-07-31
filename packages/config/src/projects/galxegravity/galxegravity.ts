import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('galxegravity')

export const galxegravity: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1719415787), // 2024-06-26T15:29:47Z
  discovery,
  additionalBadges: [BADGES.RaaS.Conduit],
  associatedTokens: ['G'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Gravity',
    slug: 'galxegravity',
    description:
      'Gravity is an Optimium built on the Orbit stack. It features onchain questing and has its own gas token - G. Other Galxe products are aiming to integrate with the L2 and a future migration to an L1 of the same name is planned.',
    links: {
      websites: ['https://gravity.xyz'],
      bridges: ['https://bridge.gravity.xyz/'],
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
  isNodeAvailable: true,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  activityConfig: {
    type: 'block',
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  celestiaDa: {
    sinceBlock: 5169794,
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAABH1QsY4w6WU=',
  },
  chainConfig: {
    name: 'galxegravity',
    coingeckoPlatform: 'gravity-alpha',
    chainId: 1625,
    explorerUrl: 'https://gscan.xyz',
    sinceTimestamp: UnixTime(1716054191), // block 1 TS
    multicallContracts: [
      {
        sinceBlock: 52682,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
    gasTokens: ['G'],
    apis: [
      { type: 'rpc', url: 'https://rpc.gravity.xyz', callsPerMinute: 1500 },
      { type: 'blockscout', url: 'https://explorer.gravity.xyz/api' },
      { type: 'blockscoutV2', url: 'https://explorer.gravity.xyz/api/v2' },
    ],
  },
})
