import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('aevo')

export const aevo: ScalingProject = opStackL2({
  addedAt: UnixTime(1694090052), // 2023-09-07T12:34:12Z
  additionalBadges: [BADGES.RaaS.Conduit],
  daProvider: EIGENDA_DA_PROVIDER(false),
  associatedTokens: ['AEVO'],
  discovery,
  additionalPurposes: ['Exchange'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Aevo',
    slug: 'aevo',
    description:
      'Aevo is a high-performance decentralized options exchange, powered by the OP Stack and EigenDA.',
    links: {
      websites: ['https://aevo.xyz/'],
      bridges: ['https://app.aevo.xyz/'],
      documentation: ['https://docs.aevo.xyz/'],
      explorers: ['https://explorer.aevo.xyz/'],
      repositories: ['https://github.com/aevoxyz'],
      socialMedia: [
        'https://twitter.com/aevoxyz',
        'https://discord.com/invite/aevo',
        'https://t.me/aevoupdates',
      ],
    },
  },
  chainConfig: {
    name: 'aevo',
    chainId: 2999,
    explorerUrl: 'https://explorer.aevo.xyz',
    sinceTimestamp: UnixTime.fromDate(new Date('2023-09-05T03:00:00Z')),
    multicallContracts: [
      {
        sinceBlock: 2790111,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-aevo-mainnet-prod-0.t.conduit.xyz',
        callsPerMinute: 800,
      },
      { type: 'blockscout', url: 'https://explorer.aevo.xyz/api' },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  nonTemplateDaTracking: [
    // {
    //   type: 'celestia',
    //   daLayer: ProjectId('celestia'),
    //   namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAADBuw7+PjGs8=',
    //   sinceBlock: 0,
    //   untilBlock: 3538077,
    // },
    {
      type: 'eigen-da',
      customerId: '0x2dc71dbd1cf713e70f939346317bf93a2e62cfee',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1753437600),
    },
  ],
  genesisTimestamp: UnixTime(1679202395),
  isNodeAvailable: false,
  milestones: [
    {
      title: 'Aevo switches to EigenDA',
      url: 'https://x.com/aevoxyz/status/1879728286093479947',
      date: '2025-01-15T00:00:00.00Z',
      description:
        'Aevo switches from Celestia to EigenDA for data availability.',
      type: 'general',
    },
    {
      title: 'Aevo Open Mainnet Launch',
      url: 'https://aevo.mirror.xyz/hV7VYkpk7caoYl2DbOFcSaZRRrK-8NeWqKczrgUff6k',
      date: '2023-06-14T00:00:00.00Z',
      description:
        'Aevo removes the whitelist and opens the mainnet to the public.',
      type: 'general',
    },
    {
      title: 'Aevo switches to Celestia',
      url: 'https://twitter.com/aevoxyz/status/1750013642278633510',
      date: '2024-01-16T00:00:00.00Z',
      description: 'Aevo starts using Celestia for data availability.',
      type: 'general',
    },
    {
      title: 'AEVO Token Airdrop',
      url: 'https://aevo.mirror.xyz/5LfLIxt_lfdoVBUTtdofAVU6YXioBzGkbhtUWnaRT-U',
      date: '2024-03-13T00:00:00.00Z',
      description: 'AEVO token launches.',
      type: 'general',
    },
  ],
})
