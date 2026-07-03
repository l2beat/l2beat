import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../../common'
import { linkByDA } from '../../common/linkByDA'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const memo: BaseProject = {
  id: ProjectId('memo'),
  slug: 'memo',
  name: 'Meeda',
  shortName: undefined,
  archivedAt: UnixTime.fromDate(new Date('2025-06-03')),
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
    description:
      'Meeda (MemoDA) is a blockchain-based cloud storage protocol developed by MEMO Labs.',
    links: {
      websites: ['https://www.memolabs.org/'],
      documentation: ['https://memolabs.gitbook.io/meeda'],
      repositories: ['https://github.com/memoio'],
      explorers: ['https://scan.metamemo.one/'],
      socialMedia: [
        'https://x.com/MemoLabsOrg',
        'https://discord.com/invite/YG4Ydv2E7X',
      ],
    },
    badges: [],
  },
  daLayer: {
    type: 'Public Blockchain',
    systemCategory: 'public',
    consensusAlgorithm: {
      name: '',
      description: '',
      blockTime: 0, // seconds average
      consensusFinality: 0,
      unbondingPeriod: 0,
    },
    technology: {
      description: readProjectMarkdown('memo', 'daLayerTechnology'),
      references: [
        {
          title: 'Meeda Documentation - Architecture',
          url: 'https://memolabs.gitbook.io/meeda/readme/overview-of-meeda/whats-meeda',
        },
        {
          title: 'Meeda FileProof contract - Metamemo Scan',
          url: 'https://scan.metamemo.one:8080/address/0x58C3Ab98546879a859EDBa3252A9d38E43C9cbee/',
        },
        {
          title: 'Meeda ControlFileProof contract - Metamemo Scan',
          url: 'https://scan.metamemo.one:8080/address/0x6eEc7578dBAD9dcc1CA159A9Df0A73233548b89a/',
        },
        {
          title: 'Meeda ProxyFileProof contract - Metamemo Scan',
          url: 'https://scan.metamemo.one:8080/address/0x0c7B5A9Ce5e33B4fa1BcFaF9e8722B1c1c23243B/',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'Memo storage nodes do not make the data available.',
        },
      ],
    },
    usedWithoutBridgeIn: linkByDA({
      layer: ProjectId('memo'),
      bridge: undefined,
    }),
    pruningWindow: 0,
    risks: {
      economicSecurity: DaEconomicSecurityRisk.OnChainNotSlashable('MEMO'),
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
    },
  },
  milestones: [
    {
      title: 'MEMO Megrez Network launch',
      url: 'https://memolabs.medium.com/memo-megrez-network-went-live-on-october-15-b99c187e041c',
      date: '2022-10-15T00:00:00Z',
      description:
        'MemoMegrez Network is the underlying storage network of the MEMO storage system.',
      type: 'general',
    },
  ],
}
