import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../../common'
import { linkByDA } from '../../common/linkByDA'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const celestia: BaseProject = {
  id: ProjectId('celestia'),
  slug: 'celestia',
  name: 'Celestia',
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
      'Celestia is a modular data availability network that allows L2s to post arbitrary data as blobs.',
    links: {
      websites: ['https://celestia.org/'],
      documentation: ['https://docs.celestia.org/'],
      repositories: ['https://github.com/celestiaorg'],
      explorers: ['https://celenium.io/'],
      socialMedia: [
        'https://x.com/Celestia',
        'https://discord.com/invite/YsnTPcSfWQ',
        'https://t.me/CelestiaCommunity',
        'https://youtube.com/@CelestiaNetwork',
      ],
    },
    badges: [],
  },
  daLayer: {
    type: 'Public Blockchain',
    systemCategory: 'public',
    technology: {
      description: readProjectMarkdown('celestia', 'daLayerTechnology'),
      references: [
        {
          title: 'Celestia Specifications',
          url: 'https://celestiaorg.github.io/celestia-app/data_structures.html',
        },
        {
          title: 'Celestia Core - CometBFT',
          url: 'https://github.com/celestiaorg/celestia-core',
        },
        {
          title: 'Celestia Node - Data Retrieval',
          url: 'https://github.com/celestiaorg/celestia-node/blob/9ff58570ef86e505b718abfc755fd18643a2284c/share/eds/retriever.go#L60',
        },
        {
          title: 'Bad Encoding Fraud Proofs',
          url: 'https://github.com/celestiaorg/celestia-node/blob/main/docs/adr/adr-006-fraud-service.md',
        },
        {
          title: 'Fraud and Data Availability Proofs paper',
          url: 'https://arxiv.org/pdf/1809.09044',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: `a dishonest supermajority of Celestia validators finalizes an unavailable block, and there aren't light nodes on the network verifying data availability, or they fail at social signaling unavailable data.`,
        },
        {
          category: 'Funds can be lost if',
          text: 'a dishonest supermajority of Celestia validators finalizes an unavailable block, and the light nodes on the network cannot collectively reconstruct the block.',
        },
      ],
    },
    usedWithoutBridgeIn: linkByDA({
      layer: ProjectId('celestia'),
      bridge: undefined,
    }),
    validators: {
      type: 'dynamic',
    },
    /*
      Node params sources:
      - unbondingPeriod: CIP-37 https://cips.celestia.org/cip-037.html
      - pruningWindow: CIP-34 https://cips.celestia.org/cip-034.html
      - finality (time_iota_ms): https://celestiaorg.github.io/celestia-app/specs/params.html
      - block time: https://github.com/celestiaorg/celestia-app/blob/main/pkg/appconsts/consensus_consts.go
      - max square size: CIP-38 https://cips.celestia.org/cip-038.html
    */
    consensusAlgorithm: {
      name: 'CometBFT',
      description: `CometBFT is the canonical implementation of the Tendermint consensus algorithm.
      CometBFT allows for a state transition machine to be written in any programming language, and it allows for secure replication across many machines.
      The consensus protocol is fork-free by construction under an honest majority of stake assumption.`,
      blockTime: 6, // seconds (CIP-26)
      consensusFinality: 1, // instant finality with CometBFT, time_iota_ms
      unbondingPeriod: UnixTime.DAY * 14 + UnixTime.HOUR, // ~14 days (CIP-37)
    },
    dataAvailabilitySampling: {
      erasureCodingScheme: '2D Reed-Solomon',
      erasureCodingProof: 'Fraud proofs',
    },
    pruningWindow: 86400 * 7 + 3600, // 7 days + 1 hour in seconds (CIP-34)
    throughput: [
      {
        size: 33554432, // 32 MiB
        frequency: 6, // 6 seconds
        sinceTimestamp: 1764802980, // 2025-12-03 23:03 UTC
      },
      {
        size: 8388608, // 8 MiB
        frequency: 6, // 6 seconds
        sinceTimestamp: 1738022400, // 2025-01-28,
      },
      {
        size: 1974272, // 1.88 MiB
        frequency: 6,
        sinceTimestamp: 1733961600, // 2024-12-12
      },
      {
        size: 1974272, // 1.88 MiB
        frequency: 12,
        sinceTimestamp: 1698710400, // 2023-10-31
      },
    ],
    finality: 6, // seconds
    risks: {
      economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
      fraudDetection: DaFraudDetectionRisk.DasWithNoBlobsReconstruction(true),
    },
    economicSecurity: {
      token: {
        symbol: 'TIA',
        decimals: 6,
        coingeckoId: 'celestia',
      },
    },
    sovereignProjectsTrackingConfig: [
      {
        projectId: ProjectId('battle-for-blockchain'),
        name: 'Battle for Blockchain',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5047670,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAKzFLTn1xOipecg=',
          },
        ],
      },
      {
        projectId: ProjectId('bullet'),
        name: 'Bullet',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 10168980,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAGJsdGJhdGNoLWw=',
          },
          {
            type: 'celestia',
            sinceBlock: 10183821,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAGJsdGJhdGNoLXQ=',
          },
          {
            type: 'celestia',
            sinceBlock: 10456208,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAGJsdGJhdGNoLXo=',
          },
        ],
      },
      {
        projectId: ProjectId('camp'),
        name: 'Camp',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 6459709,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAB7AAAAAAAAAeQ=',
          },
        ],
      },
      {
        projectId: ProjectId('civitia'),
        name: 'Civitia',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 4492300,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAEwLOhV+kOUlUq4=',
          },
        ],
      },
      {
        projectId: ProjectId('clique'),
        name: 'Clique',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 3161819,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAARQV7t6sd4A=',
          },
        ],
      },
      {
        projectId: ProjectId('echelon'),
        name: 'Echelon',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5659637,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAItyY42OaTC/skE=',
          },
        ],
      },
      {
        projectId: ProjectId('echos'),
        name: 'Echos',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 3161819,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA/cZMN1XLG8=',
          },
        ],
      },
      {
        projectId: ProjectId('eden'),
        name: 'Eden',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 9409947,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAORr5sRrVhwIjmU=',
          },
          {
            type: 'celestia',
            sinceBlock: 9413424,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAoxK5AW18ozObY=',
          },
        ],
      },
      {
        projectId: ProjectId('embr-fun'),
        name: 'Embr.fun',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5954601,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAMbONmnisjTDz4I=',
          },
        ],
      },
      {
        projectId: ProjectId('flame'),
        name: 'Flame',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 3161819,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAL2dxfeNrJ+tg6Y=',
          },
        ],
      },
      {
        projectId: ProjectId('flynet'),
        name: 'Flynet',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5188001,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAACyPE7Ql9zwA=',
          },
        ],
      },
      {
        projectId: ProjectId('forma'),
        name: 'Forma',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 3161819,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAKKnitomrCy/HoY=',
          },
        ],
      },
      {
        projectId: ProjectId('foundation-network'),
        name: 'Foundation Network',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 3667737,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAN/xAxpagCrjLVQ=',
          },
        ],
      },
      {
        projectId: ProjectId('hibachi'),
        name: 'Hibachi',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5979823,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAABoaWJhY2hpLXM=',
          },
          {
            type: 'celestia',
            sinceBlock: 5981133,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhpYmFjaGk=',
          },
        ],
      },
      {
        projectId: ProjectId('ing'),
        name: 'ING',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5945453,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAALdhUSKgKHU0Zx0=',
          },
        ],
      },
      {
        projectId: ProjectId('inertia'),
        name: 'Inertia',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5941532,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAEg2If2QGyq4ZRQ=',
          },
        ],
      },
      {
        projectId: ProjectId('intergaze'),
        name: 'Intergaze',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5748411,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAIoZCJNLh1XvOZA=',
          },
        ],
      },
      {
        projectId: ProjectId('milkyway'),
        name: 'Milkyway',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5298640,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAB2AZsEwLd1LLHk=',
          },
        ],
      },
      {
        projectId: ProjectId('onchain'),
        name: 'Onchain',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 3161819,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAABNfLrOLSCTY=',
          },
        ],
      },
      {
        projectId: ProjectId('perennial'),
        name: 'Perennial',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 3886561,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAaToZYrE0tA=',
          },
        ],
      },
      {
        projectId: ProjectId('rave'),
        name: 'Rave',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5645296,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAF45zaUciayEPXE=',
          },
        ],
      },
      {
        projectId: ProjectId('relay-chain'),
        name: 'Relay Chain',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 9272873,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAHJlbGF5LWRhdGE=',
          },
        ],
      },
      {
        projectId: ProjectId('rena'),
        name: 'Rena',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5775045,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAMxohfftlR5t59s=',
          },
        ],
      },
      {
        projectId: ProjectId('rivalz-network'),
        name: 'Rivalz Network',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 4932528,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE=',
          },
        ],
      },
      {
        projectId: ProjectId('xo-market'),
        name: 'XO Market',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 8164261,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAACnGTcXcpKRnenc=',
          },
          {
            type: 'celestia',
            sinceBlock: 8383370,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAEjr00EdZDGvoMU=',
          },
        ],
      },
      {
        projectId: ProjectId('yominet'),
        name: 'Yominet',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5966190,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAFjh+OUc/ORU/0o=',
          },
        ],
      },
      {
        projectId: ProjectId('zaar'),
        name: 'Zaar',
        daTrackingConfig: [
          {
            type: 'celestia',
            sinceBlock: 5587852,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAM8NBxiaOQwFwQc=',
          },
        ],
      },
    ],
  },
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://blog.celestia.org/celestia-mainnet-is-live/',
      date: '2023-10-31T00:00:00Z',
      description: 'Celestia mainnet launches.',
      type: 'general',
    },
    {
      title: 'Ginger upgrade',
      url: 'https://blog.celestia.org/ginger/',
      date: '2024-12-12T00:00:00Z',
      description:
        'Celestia Ginger upgrade cuts the block time in half from 12 to 6 seconds.',
      type: 'general',
    },
    {
      title: 'Block size increase to 8MB',
      url: 'https://x.com/celestia/status/1881756463317860430/',
      date: '2025-01-28T00:00:00Z',
      description:
        'Celestia onchain governance votes to increase the block size from 2MB to 8MB.',
      type: 'general',
    },
    {
      title: 'Matcha upgrade',
      url: 'https://blog.celestia.org/matcha/',
      date: '2025-11-24T00:00:00Z',
      description:
        'Matcha upgrade enables 128MB blocks, reduces unbonding period to 14 days, and introduces high-throughput block propagation.',
      type: 'general',
    },
    {
      title: 'Block size increase to 32MB',
      url: 'https://celenium.io/proposal/8',
      date: '2025-12-03T00:00:00Z',
      description:
        'Celestia onchain governance votes to increase the block size from 8MB to 32MB.',
      type: 'general',
    },
  ],
}
