import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('zora')

export const zora: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1687459278), // 2023-06-22T18:41:18Z
  discovery,
  additionalBadges: [BADGES.RaaS.Conduit],
  additionalPurposes: ['NFT'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Zora',
    slug: 'zora',
    description:
      'Zora is a fast, cost-efficient, and scalable Layer 2 built to help bring media onchain, powered by the OP Stack.',
    links: {
      websites: ['https://zora.energy/', 'https://zora.co/'],
      bridges: ['https://bridge.zora.energy/'],
      documentation: ['https://docs.zora.co'],
      explorers: ['https://explorer.zora.energy/', 'https://zorascan.xyz'],
      repositories: ['https://github.com/ourzora/optimism'],
      socialMedia: [
        'https://twitter.com/zora',
        'https://instagram.com/our.zora',
        'https://zora.community',
      ],
    },
  },
  hasSuperchainScUpgrades: true,
  chainConfig: {
    name: 'zora',
    chainId: 7777777,
    explorerUrl: 'https://explorer.zora.energy',
    // ~ Timestamp of block number 0 on Zora
    // The first full hour timestamp that will return the block number
    // https://explorer.zora.energy/block/0
    sinceTimestamp: UnixTime.fromDate(new Date('2023-06-14T01:04:00Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5882,
        version: '3',
      },
    ],
    coingeckoPlatform: 'zora',
    apis: [
      { type: 'rpc', url: 'https://rpc.zora.energy', callsPerMinute: 300 },
      { type: 'blockscout', url: 'https://explorer.zora.energy/api' },
    ],
  },
  genesisTimestamp: UnixTime(1686695915),
  stateDerivation: DERIVATION.OPSTACK('ZORA'),
  isNodeAvailable: true,
  milestones: [
    {
      title: 'Zora starts using blobs',
      url: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Zora starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Zora Network Launch',
      url: 'https://twitter.com/ourZORA/status/1671602234994622464',
      date: '2023-06-21T00:00:00Z',
      description: 'Zora Network is live on mainnet.',
      type: 'general',
    },
  ],
})
