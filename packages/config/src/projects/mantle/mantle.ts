import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('mantle')

export const mantle: ScalingProject = opStackL2({
  addedAt: UnixTime(1680782525), // 2023-04-06T12:02:05Z
  daProvider: EIGENDA_DA_PROVIDER,
  associatedTokens: ['MNT'],
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'FBTC'],
  discovery,
  additionalBadges: [BADGES.DA.EigenDA],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Mantle',
    slug: 'mantle',
    description:
      'Mantle is a modular general-purpose Optimium with a protocol design philosophy that aims to offer users a less costly and more user-friendly experience, provide developers with a simpler and more flexible development environment, and deliver a comprehensive set of infrastructure for the next wave of mass-adopted dApps.',
    links: {
      websites: ['https://mantle.xyz/'],
      bridges: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs-v2.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
  },
  genesisTimestamp: UnixTime(1688428800),
  chainConfig: {
    name: 'mantle',
    chainId: 5000,
    explorerUrl: 'https://explorer.mantle.xyz',
    sinceTimestamp: UnixTime(1688314886),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 304717,
        version: '3',
      },
    ],
    coingeckoPlatform: 'mantle',
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mantle.xyz',
        callsPerMinute: 1500,
      },
      {
        type: 'blockscout',
        url: 'https://explorer.mantle.xyz/api',
      },
    ],
  },
  milestones: [
    {
      title: 'Move to EigenDA',
      url: 'https://github.com/mantlenetworkio/mantle-v2/releases/tag/v1.1.1',
      date: '2025-03-19T00:00:00.00Z',
      description:
        'Mantle deactivates MantleDA and data availability migrates to EigenDA.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://www.mantle.xyz/blog/announcements/mantle-network-mainnet-alpha',
      date: '2023-07-14T00:00:00.00Z',
      description: 'Mantle is live on mainnet.',
      type: 'general',
    },
    {
      title: 'Mainnet v2 Tectonic Upgrade',
      url: 'https://www.mantle.xyz/blog/announcements/mantle-completes-mainnet-v2-tectonic-upgrade',
      date: '2024-03-15T00:00:00.00Z',
      description: 'Mantle completes Mainnet v2 Tectonic Upgrade.',
      type: 'general',
    },
    {
      title: 'MNT token migration begins',
      url: 'https://www.mantle.xyz/blog/announcements/bit-to-mnt-user-guide',
      date: '2023-07-11T00:00:00.00Z',
      description: 'User can exchange their BIT tokens to MNT tokens.',
      type: 'general',
    },
  ],
  nonTemplateOptimismPortalEscrowTokens: ['MNT'],
  nonTemplateDaTracking: [
    {
      type: 'eigen-da',
      customerId: '0x24f0a3716805e8973bf48eb908d6d4a2f34af785',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1738821600),
    },
  ],
})
