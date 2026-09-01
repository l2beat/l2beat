import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../../common'
import { linkByDA } from '../../common/linkByDA'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const near: BaseProject = {
  id: ProjectId('near-da'), // TODO: merge with near bridge in the future
  slug: 'near',
  name: 'NEAR DA',
  shortName: undefined,
  archivedAt: UnixTime.fromDate(new Date('2026-04-28')),
  addedAt: UnixTime.fromDate(new Date('2024-09-03')),
  // data
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: `NEAR's Data Availability Layer (NEAR DA) leverages the sharded architecture of the NEAR Protocol to provide a modular data availability layer for layer 2 solutions.`,
    links: {
      websites: ['https://near.org/', 'https://nuff.tech/'],
      documentation: [
        'https://docs.near.org/build/chain-abstraction/data-availability',
      ],
      repositories: [
        'https://github.com/near',
        'https://github.com/Nuffle-Labs/data-availability',
      ],
      explorers: ['https://nearblocks.io/'],
      socialMedia: [
        'https://x.com/NEARProtocol',
        'https://discord.com/invite/zfhfRpaM4m',
      ],
    },
    badges: [],
  },
  daLayer: {
    type: 'Public Blockchain',
    systemCategory: 'public',
    consensusAlgorithm: {
      name: 'Nightshade',
      description: readProjectMarkdown('near', 'daLayerConsensusAlgorithm'), // this is not shown anywhere in the UI, and maybe we don't need it
      blockTime: 0.6, // seconds average
      consensusFinality: 1.2, // NFG (Nightshade finality gadget, after 2 consecutive blocks are built on the same fork we consider the t-2 block final, thus transactions belonging to t-2 are final )
      unbondingPeriod: 86400 * 2, // up to 48 hours
    },
    technology: {
      description: readProjectMarkdown('near', 'daLayerTechnology'),
      references: [
        {
          title: 'Near Nightshade Consensus',
          url: 'https://pages.near.org/downloads/Nightshade.pdf',
        },
        {
          title: 'Near Doomslug Finality Gadget',
          url: 'https://discovery-domain.org/papers/doomslug.pdf',
        },
        {
          title: 'Near documentation',
          url: 'https://docs.near.org/',
        },
        {
          title: 'Near Core - Architecture',
          url: 'https://near.github.io/nearcore/',
        },
        {
          title: 'Blob Store contract - Nuffle Labs',
          url: 'https://github.com/Nuffle-Labs/data-availability/blob/5026b81aa5d941aaf4dd1b23bc219b9150e84405/contracts/blob-store/src/lib.rs',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'a dishonest majority of Near validators finalizes an unavailable block.',
        },
      ],
    },
    usedWithoutBridgeIn: linkByDA({
      layer: ProjectId('near-da'),
      bridge: undefined,
    }),
    pruningWindow: 43200 * 3, // minimum 3 epochs (12 hours each), claimed in practice around 5 epochs (due to nodes garbage collection)
    throughput: [
      {
        size: 16777216, // 16 MiB , 4MiB per 4 shards
        frequency: 1, // 16 MiB/s
        sinceTimestamp: 1587513600, // 2020-04-22
      },
      {
        size: 33554432, // 32 MiB , 4MiB per 8 shards
        frequency: 1, // 32 MiB/s
        sinceTimestamp: 1742342400, // 2025-03-19
      },
      {
        size: 33554432, // 32 MiB , 4MiB per 8 shards
        frequency: 0.6, // 600ms block time
        sinceTimestamp: 1747141200, // 2025-05-13
      },
      {
        size: 37748736, // 36 MiB , 4MiB per 9 shards
        frequency: 0.6, // 600ms block time
        sinceTimestamp: 1755561600, // 2025-08-19
      },
    ],
    risks: {
      economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
    },
    economicSecurity: {
      token: {
        symbol: 'NEAR',
        decimals: 24,
        coingeckoId: 'near',
      },
    },
    validators: {
      type: 'dynamic',
    },
  },
  milestones: [
    {
      title: 'NEAR reduces block time to 600ms',
      url: 'https://pages.near.org/blog/blink-and-its-final-near-launches-600ms-blocks-and-1-2s-finality/',
      date: '2025-05-13T00:00:00Z',
      description:
        'NEAR reduces block time to 600ms, achieving finality in 1.2 seconds.',
      type: 'general',
    },
    {
      title: 'NEAR upgrades to 9 shards',
      url: 'https://learnnear.club/near-protocol-scales-up-9-shards-now-live-with-12-5-performance-boost/',
      date: '2025-08-19T00:00:00Z',
      description: 'NEAR upgrades from 8 to 9 shards.',
      type: 'general',
    },
    {
      title: 'NEAR upgrades to 8 shards',
      url: 'https://x.com/NEARProtocol/status/1903780872760988037',
      date: '2025-03-19T00:00:00Z',
      description: 'NEAR upgrades from 6 to 8 shards.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://near.org/blog/near-mainnet-genesis',
      date: '2020-04-22T00:00:00Z',
      description: 'Near mainnet launches.',
      type: 'general',
    },
    {
      title: 'Near Foundation launches Near DA',
      url: 'https://medium.com/nearprotocol/near-foundation-launches-near-da-to-offer-secure-cost-effective-data-availability-for-eth-rollups-2d26beeb4cd8',
      date: '2023-11-08T00:00:00Z',
      description:
        'Near Foundation proposes Near DA as a data availability layer for Ethereum L2s.',
      type: 'general',
    },
  ],
}
