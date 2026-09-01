import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../../common'
import { linkByDA } from '../../common/linkByDA'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const avail: BaseProject = {
  id: ProjectId('avail'),
  slug: 'avail',
  name: 'Avail',
  shortName: undefined,
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
      'Avail is a public blockchain and data availability network combining erasure coding, KZG polynomial commitments, and data availability sampling.',
    links: {
      websites: ['https://www.availproject.org/'],
      documentation: ['https://docs.availproject.org/'],
      repositories: ['https://github.com/availproject/'],
      bridges: ['https://bridge.availproject.org/'],
      explorers: [
        'https://explorer.avail.so/#/explorer',
        'https://avail.subscan.io/',
      ],
      socialMedia: [
        'https://x.com/AvailProject',
        'https://t.me/AvailCommunity',
        'https://discord.com/invite/AvailProject',
        'https://www.linkedin.com/company/availproject/',
      ],
    },
    badges: [],
  },
  daLayer: {
    type: 'Public Blockchain',
    systemCategory: 'public',
    technology: {
      description: readProjectMarkdown('avail', 'daLayerTechnology'),
      references: [
        {
          title: 'Avail Documentation',
          url: 'https://docs.availproject.org/docs/welcome-to-avail-docs',
        },
        {
          title: 'Avail Light Client - Source Code',
          url: 'https://github.com/availproject/avail-light/blob/main/core/src/light_client.rs',
        },
        {
          title: 'Avail App Client - Source Code',
          url: 'https://github.com/availproject/avail-light/blob/a9e1741a6c7579d6ab1988eb409808b33f999180/core/src/app_client.rs',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: `a dishonest supermajority of Avail validators finalizes an unavailable block, and there aren't light nodes on the network verifying data availability, or they fail at social signaling unavailable data.`,
        },
        {
          category: 'Funds can be lost if',
          text: 'a dishonest supermajority of Avail validators finalizes an unavailable block, and the light nodes on the network cannot collectively reconstruct the block.',
        },
      ],
    },
    usedWithoutBridgeIn: linkByDA({
      layer: ProjectId('avail'),
      bridge: undefined,
    }),
    /*
      Node params sources:
    */
    consensusAlgorithm: {
      name: 'BABE/GRANDPA',
      description:
        'Avail uses the BABE/GRANDPA consensus algorithm. BABE is a block production mechanism that is used to create new blocks in the Avail blockchain. GRANDPA is a finality gadget that is used to finalize blocks.',
      blockTime: 20, // seconds
      consensusFinality: 60, //seconds
      unbondingPeriod: UnixTime.DAY * 28, // staking.UnbondingTime
    },
    throughput: [
      {
        size: 4194304, // 4 MiB
        frequency: 20, // 20 seconds
        sinceTimestamp: 1739883920, // 2025-02-18
      },
      {
        size: 2097152, // 2 MiB
        frequency: 20, // 20 seconds
        sinceTimestamp: 1721692800, // 2024-07-23
      },
    ],
    finality: 40, // best case is 2 blocks
    sovereignProjectsTrackingConfig: [
      {
        projectId: ProjectId('avail-main'),
        name: 'Avail',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['0'],
          },
        ],
      },
      {
        projectId: ProjectId('reserved-1'),
        name: 'Reserved-1',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['1'],
          },
        ],
      },
      {
        projectId: ProjectId('reserved-2'),
        name: 'Reserved-2',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['2'],
          },
        ],
      },
      {
        projectId: ProjectId('reserved-3'),
        name: 'Reserved-3',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['3'],
          },
        ],
      },
      {
        projectId: ProjectId('reserved-4'),
        name: 'Reserved-4',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['4'],
          },
        ],
      },
      {
        projectId: ProjectId('reserved-5'),
        name: 'Reserved-5',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['5'],
          },
        ],
      },
      {
        projectId: ProjectId('reserved-6'),
        name: 'Reserved-6',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['6'],
          },
        ],
      },
      {
        projectId: ProjectId('reserved-7'),
        name: 'Reserved-7',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['7'],
          },
        ],
      },
      {
        projectId: ProjectId('reserved-8'),
        name: 'Reserved-8',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['8'],
          },
        ],
      },
      {
        projectId: ProjectId('reserved-9'),
        name: 'Reserved-9',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['9'],
          },
        ],
      },
      {
        projectId: ProjectId('0x84e96bb748abb8a16c28ecc'),
        name: '0x84e96bb748abb8a16c28ecc',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['10'],
          },
        ],
      },
      {
        projectId: ProjectId('leouarz-test-app'),
        name: 'Leouarz test app',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['11'],
          },
        ],
      },
      {
        projectId: ProjectId('bling'),
        name: 'bling',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['12'],
          },
        ],
      },
      {
        projectId: ProjectId('hello-world'),
        name: 'hello world',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['13'],
          },
        ],
      },
      {
        projectId: ProjectId('azeazeqsdhfgkjkk'),
        name: 'azeazeqsdhfgkjkk',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['14'],
          },
        ],
      },
      {
        projectId: ProjectId('jjjtkekznfnxkeke'),
        name: 'Jjjtkekznfnxkeke',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['15'],
          },
        ],
      },
      {
        projectId: ProjectId('crestal'),
        name: 'CRESTAL',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['16'],
          },
        ],
      },
      {
        projectId: ProjectId('170889'),
        name: '170889',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['18'],
          },
        ],
      },
      {
        projectId: ProjectId('skate-mainnet'),
        name: 'skate-mainnet',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['19'],
          },
        ],
      },
      {
        projectId: ProjectId('lc85p'),
        name: 'lc85p',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['20'],
          },
        ],
      },
      {
        projectId: ProjectId('dragonft'),
        name: 'Dragonft',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['21'],
          },
        ],
      },
      {
        projectId: ProjectId('fuse-l2'),
        name: 'fuse-l2',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['22'],
          },
        ],
      },
      {
        projectId: ProjectId('antonio'),
        name: 'antonio',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['23'],
          },
        ],
      },
      {
        projectId: ProjectId('se-avail'),
        name: 'se-avail',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['24'],
          },
        ],
      },
      {
        projectId: ProjectId('527d69c3'),
        name: 'Rooch Network',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['25'],
          },
        ],
      },
      {
        projectId: ProjectId('kayabey'),
        name: 'kayabey',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['27'],
          },
        ],
      },
      {
        projectId: ProjectId('kms'),
        name: 'KMS',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['28'],
          },
        ],
      },
      {
        projectId: ProjectId('dans-awesome-app'),
        name: "Dan's Awesome App",
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['29'],
          },
        ],
      },
      {
        projectId: ProjectId('up-or-down'),
        name: 'Up or Down',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['30'],
          },
        ],
      },
      {
        projectId: ProjectId('svmbnb-mainnet'),
        name: 'svmbnb-mainnet',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['31'],
          },
        ],
      },
      {
        projectId: ProjectId('odysphere'),
        name: 'odysphere',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['32'],
          },
        ],
      },
      {
        projectId: ProjectId('uwu'),
        name: 'UwU',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['33'],
          },
        ],
      },
      {
        projectId: ProjectId('art-peace'),
        name: 'art-peace',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['35'],
          },
        ],
      },
      {
        projectId: ProjectId('lens-historical-data'),
        name: 'lens-historical-data',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['39'],
          },
        ],
      },
      {
        projectId: ProjectId('ody-playground'),
        name: 'ody_playground',
        daTrackingConfig: [
          {
            type: 'avail',
            sinceBlock: 0,
            appIds: ['40'],
          },
        ],
      },
    ],
    dataAvailabilitySampling: {
      erasureCodingScheme: '2D Reed-Solomon',
      erasureCodingProof: 'Validity proofs',
    },
    pruningWindow: 0, // does not prune
    risks: {
      economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
      fraudDetection: DaFraudDetectionRisk.DasWithNoBlobsReconstruction(true),
    },
    economicSecurity: {
      token: {
        symbol: 'AVAIL',
        decimals: 18,
        coingeckoId: 'avail',
      },
    },
    validators: {
      type: 'dynamic',
    },
  },

  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://blog.availproject.org/avail-da-mainnet-is-live/',
      date: '2024-07-23T00:00:00Z',
      description: 'Avail mainnet and the AVAIL token launch.',
      type: 'general',
    },
    {
      title: 'Block size increase',
      url: 'https://avail.subscan.io/tech/27',
      date: '2025-02-18T00:00:00Z',
      description: 'Avail doubles the block size to 4 MB.',
      type: 'general',
    },
  ],
}
