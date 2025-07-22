import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DA_BRIDGES, DA_LAYERS, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('rss3')

export const rss3: ScalingProject = opStackL2({
  addedAt: UnixTime(1705391231), // 2024-01-16T07:47:11Z
  daProvider: {
    layer: DA_LAYERS.NEAR_DA,
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely fully on data that is NOT published on chain.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data required to compute fraud proof is not published on chain, and currently not publicly accessible',
      description:
        'Transaction data is submitted to a blob store contract on NearDA. Only hashes of blob data is published on an onchain inbox.',
      references: [
        {
          title: 'REP-20 - Data Availability Layer Integration',
          url: 'https://github.com/RSS3-Network/REPs/blob/main/REPs/REP-20.md',
        },
        {
          title: 'RSS3 NearDA blob store contract',
          url: 'https://nearblocks.io/address/vsl-da.near',
        },
        {
          title: 'On-Chain Inbox',
          url: 'https://etherscan.io/address/0xfFFF000000000000000000000000000000012553',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the data is not made available on the external provider.',
          isCritical: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an unavailable or malicious transaction root.',
          isCritical: true,
        },
      ],
    },
    bridge: DA_BRIDGES.NONE,
    badge: BADGES.DA.NearDA,
  },
  associatedTokens: ['RSS3'],
  discovery,
  additionalPurposes: ['AI', 'Information'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    shortName: 'RSS3 VSL',
    name: 'RSS3 Value Sublayer',
    slug: 'rss3',
    description:
      'The RSS3 Value Sublayer (VSL) as part of the RSS3 Network, is an Ethereum ScalingProject built with OP Stack, handling the value and ownership of AI and Open Information.',
    links: {
      websites: ['https://rss3.io'],
      bridges: [
        'https://explorer.rss3.io/bridge',
        'https://explorer.rss3.io/nodes',
        'https://explorer.rss3.io/epochs',
        'https://explorer.rss3.io/dsl-scan',
      ],
      documentation: ['https://docs.rss3.io'],
      explorers: ['https://explorer.rss3.io', 'https://scan.rss3.io'],
      repositories: ['https://github.com/rss3-network'],
      socialMedia: [
        'https://twitter.com/rss3_',
        'https://discord.com/invite/rss3-network',
        'https://t.me/rss3_en',
      ],
    },
  },
  chainConfig: {
    name: 'rss3',
    chainId: 12553,
    explorerUrl: 'https://scan.rss3.io',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 14193,
        version: '3',
      },
    ],
    apis: [
      { type: 'rpc', url: 'https://rpc.rss3.io/', callsPerMinute: 1500 },
      { type: 'blockscout', url: 'https://scan.rss3.io/api' },
    ],
  },
  genesisTimestamp: UnixTime(1709858519),
  isNodeAvailable: false,
  milestones: [
    {
      title: 'RSS3 Mainnet Alpha Launch',
      url: 'https://x.com/rss3_/status/1767370007275851789',
      date: '2024-03-12T00:00:00Z',
      description: 'RSS3 Network Mainnet Alpha is live.',
      type: 'general',
    },
    {
      title: 'RSS3 starts using NearDA',
      url: 'https://x.com/rss3_/status/1788183577219436985',
      date: '2024-05-07T00:00:00Z',
      description: 'RSS3 Network starts publishing data to NearDA.',
      type: 'general',
    },
  ],
})
