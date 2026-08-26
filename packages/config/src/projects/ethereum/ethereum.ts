import {
  assert,
  EthereumAddress,
  formatNumber,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  EthereumDaBridgeRisks,
  EthereumDaLayerRisks,
  SEQUENCING_SPEC,
} from '../../common'
import { linkByDA } from '../../common/linkByDA'
import { HARDCODED } from '../../discovery/values/hardcoded'
import { type BaseProject, ProjectStakeDistributionSchema } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import stakeDistributionJson from './stake-distribution.json'

const stakeDistribution = ProjectStakeDistributionSchema.parse(
  stakeDistributionJson,
)
assert(
  stakeDistribution.validatorCount !== undefined,
  'Ethereum stake distribution must include validatorCount',
)

const chainId = 1
const ethereumBlockTimeSeconds = HARDCODED.ETHEREUM.BLOCK_TIME_SECONDS
const ethereumEpochSeconds =
  HARDCODED.ETHEREUM.SLOTS_PER_EPOCH * ethereumBlockTimeSeconds

// Deployment of the first L2
export const MIN_TIMESTAMP_FOR_TVL = UnixTime.fromDate(
  new Date('2019-11-14T00:00:00Z'),
)

export const ethereum: BaseProject = {
  id: ProjectId('ethereum'),
  slug: 'ethereum',
  name: 'Ethereum',
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
    // name: 'Ethereum (EIP-4844)',
    description: `Ethereum is a Proof of Stake (PoS) network that enables the creation and execution of smart contracts and decentralized applications (dApps) using its native cryptocurrency, Ether (ETH).
      EIP-4844 allows for blob-carrying transactions containing large amounts of data on the consensus layer, and whose commitment can be accessed by the EVM on the execution layer.`,
    links: {
      websites: ['https://ethereum.org/en/'],
      documentation: ['https://ethereum.org/en/developers/docs/'],
      repositories: [
        'https://ethereum.org/en/developers/docs/nodes-and-clients/#execution-clients',
        'https://ethereum.org/en/developers/docs/nodes-and-clients/#consensus-clients',
      ],
      explorers: [
        'https://etherscan.io/',
        'https://ethplorer.io/',
        'https://eth.blockscout.com/',
        'https://beaconcha.in/',
      ],
      socialMedia: [
        'https://x.com/ethereum',
        'https://discord.com/invite/ethereum-org',
      ],
    },
    badges: [],
  },
  scalingTechnology: {
    sequencing: {
      name: 'Transactions are ordered by Ethereum validators and builders',
      description: readProjectMarkdown('ethereum', 'technologySequencing'),
      sequencingSpec: {
        type: 'sequencer-set',
        blockTime: { value: `${ethereumBlockTimeSeconds} seconds` },
        proposerRotationTime: {
          value: `${ethereumBlockTimeSeconds} seconds`,
          description:
            'One validator index is selected for every slot with probability proportional to its effective balance. A missed proposal leaves the slot empty.',
        },
        sequencerCount: {
          value: `${stakeDistribution.validatorCount.toLocaleString('en-US')} validator indices`,
          secondLine: `${formatNumber(stakeDistribution.totalStake)} ${stakeDistribution.stakeToken}`,
          description:
            'This snapshot is generated from Dune validator-day summaries and curated staking attribution. Lido stake is split among its node operators. Validator indices are not independent operators, and compounding validators can have different effective balances.',
        },
        blockProductionAccess: SEQUENCING_SPEC.OPEN_BLOCK_PRODUCTION(
          'Anyone can deposit the minimum stake and join the activation queue without governance approval. Activation remains subject to protocol churn limits.',
        ),
        stakePerValidator: {
          value: `${HARDCODED.ETHEREUM.MIN_ACTIVATION_BALANCE_ETH} ETH minimum, variable`,
          description: `Compounding validators can have an effective balance of up to ${HARDCODED.ETHEREUM.MAX_EFFECTIVE_BALANCE_ETH.toLocaleString('en-US')} ETH. Proposal probability is weighted by effective balance.`,
        },
        rateLimit: {
          value: `${HARDCODED.ETHEREUM.MAX_ACTIVATION_CHURN_ETH_PER_EPOCH} ETH per epoch`,
          description: `Validator activation is limited by an effective-balance churn cap. An epoch contains ${HARDCODED.ETHEREUM.SLOTS_PER_EPOCH} slots and lasts ${formatSeconds(ethereumEpochSeconds)}.`,
        },
        deterministicCrGadget: SEQUENCING_SPEC.NO_DETERMINISTIC_CR_GADGET(
          'Ethereum mainnet does not currently enforce a forced-transaction queue or inclusion list. Inclusion-list proposals such as FOCIL are not live on mainnet.',
        ),
        additionalCrGadgets: {
          value: 'Local block building, diverse operators',
          sentiment: 'warning',
          description:
            'A proposer can build locally to include public-mempool transactions instead of accepting an external builder bid. This bypasses censoring builders and relays, but users cannot compel the proposer to use the fallback. Combining a highly decentralized operator set with per-slot proposer rotation results in short inclusion delays under selective censorship.',
        },
      },
      inclusionDelayChart: {
        type: 'ethereumlike',
        validatorCount: stakeDistribution.validatorCount,
        slotSeconds: ethereumBlockTimeSeconds,
        target: 0.99,
        maxCensorFraction: 0.5,
        stakeDistribution,
      },
      inclusionDelayChartDescription:
        'The chart models live-chain selective censorship as independent stake-weighted proposer opportunities. It assumes an honest proposer can include the transaction, whether through an external builder or local block production. It excludes validator and builder concentration, finality, validator-set changes, inactivity leaks, and a full halt.',
      censorshipResistance: readProjectMarkdown(
        'ethereum',
        'censorshipResistance',
      ),
      references: [
        {
          title: 'Ethereum.org - Block proposal',
          url: 'https://ethereum.org/developers/docs/consensus-mechanisms/pos/block-proposal/',
        },
        {
          title: 'Ethereum consensus specifications - Electra',
          url: 'https://ethereum.github.io/consensus-specs/electra/beacon-chain/',
        },
        {
          title: 'EIP-7251 - Increase the MAX_EFFECTIVE_BALANCE',
          url: 'https://eips.ethereum.org/EIPS/eip-7251',
        },
        {
          title: 'MEV-Boost',
          url: 'https://github.com/flashbots/mev-boost',
        },
        {
          title: 'Ethereum.org - Proof-of-stake rewards and penalties',
          url: 'https://ethereum.org/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'proposers or their selected builders keep excluding their transactions, or block production halts and requires social recovery.',
        },
      ],
    },
  },
  daLayer: {
    type: 'Public Blockchain',
    systemCategory: 'public',
    technology: {
      description: readProjectMarkdown('ethereum', 'daLayerTechnology'),
      references: [
        {
          title: 'EIP-4844',
          url: 'https://eips.ethereum.org/EIPS/eip-4844',
        },
        {
          title: 'Ethereum Technical Handbook',
          url: 'https://eth2book.info/latest/',
        },
      ],
    },
    usedWithoutBridgeIn: [],
    consensusAlgorithm: {
      name: 'Gasper',
      description: readProjectMarkdown('ethereum', 'daLayerConsensusAlgorithm'),
      blockTime: ethereumBlockTimeSeconds,
      consensusFinality:
        ethereumBlockTimeSeconds * 2 * HARDCODED.ETHEREUM.SLOTS_PER_EPOCH,
      unbondingPeriod: 777600, // current value from validatorqueue.com. Technically it is the sum of 1) Exit Queue (variable) 2) fixed waiting time (27.3 hours), 3) Validator Sweep (variable).
    },
    throughput: [
      {
        size: 786432, // 0.75 MiB
        target: 393216, // 0.375 MiB
        frequency: ethereumBlockTimeSeconds,
        sinceTimestamp: 1710288000, // 2024-03-13
      },
      {
        // EIP-7691: Prague / Electra hard-fork – increased blob limits
        size: 1_179_648, // 1.125 MiB (max 9 blobs × 128 KiB)
        target: 786_432, // 0.75 MiB (target 6 blobs × 128 KiB)
        frequency: ethereumBlockTimeSeconds,
        sinceTimestamp: 1746612300, // 2025-05-07 10:05:00 UTC ≈ Pectra main-net epoch 364032
      },
      {
        // BPO1: Blob Parameter Only fork 1 (post-Fusaka PeerDAS)
        size: 1_966_080, // 1.875 MiB (max 15 blobs × 128 KiB)
        target: 1_310_720, // 1.25 MiB (target 10 blobs × 128 KiB)
        frequency: ethereumBlockTimeSeconds,
        sinceTimestamp: 1765290071, // 2025-12-09 14:21:11 UTC – epoch 412672
      },
      {
        // BPO2: Blob Parameter Only fork 2
        size: 2_752_512, // 2.625 MiB (max 21 blobs × 128 KiB)
        target: 1_835_008, // 1.75 MiB (target 14 blobs × 128 KiB)
        frequency: ethereumBlockTimeSeconds,
        sinceTimestamp: 1767747671, // 2026-01-07 01:01:11 UTC – epoch 419072
      },
    ],
    finality: ethereumBlockTimeSeconds * 2 * HARDCODED.ETHEREUM.SLOTS_PER_EPOCH,
    pruningWindow: 86400 * 18, // 18 days in seconds
    risks: {
      daLayer: EthereumDaLayerRisks.SelfVerify,
    },
    economicSecurity: {
      token: {
        symbol: 'ETH',
        decimals: 18,
        coingeckoId: 'ethereum',
      },
    },
    validators: {
      type: 'dynamic',
    },
    sovereignProjectsTrackingConfig: [
      {
        projectId: ProjectId('codex'),
        name: 'Codex',
        daTrackingConfig: [
          {
            type: 'ethereum',
            inbox: '0x8c12f051c161c2cda736f3b3fa1c4bdd35b7922c',
            sequencers: ['0xb5bd290ef8ef3840cb866c7a8b7cc9e45fde3ab9'],
            sinceBlock: 20953494,
          },
        ],
      },
      {
        projectId: ProjectId('quarkchain'),
        name: 'QuarkChain SWC',
        daTrackingConfig: [
          {
            type: 'ethereum',
            inbox: '0xa68295d77766d4e04854746e3c1873c891c1765e',
            sequencers: ['0xf503a133df0c43b4814b12098604655ad9fe7e3b'],
            sinceBlock: 23847277,
          },
        ],
      },
      {
        projectId: ProjectId('creator'),
        name: 'Creator',
        daTrackingConfig: [
          {
            type: 'ethereum',
            inbox: '0x18cc381705761aa2d2e8ea62888a4029a0fad3ab',
            sequencers: [
              '0x9f915dd047b9d64a94e62aa141da3c7425c9431f',
              '0x0bf4b30e680cc7cbab1c2436275851bcc9d35dc1',
            ],
            sinceBlock: 23869474,
          },
        ],
      },
      {
        projectId: ProjectId('openzk'),
        name: 'OpenZK',
        daTrackingConfig: [
          {
            type: 'ethereum',
            inbox: '0x8c0Bfc04AdA21fd496c55B8C50331f904306F564',
            sequencers: ['0x1c841ed065149e32e4c43e3b10ecd71f1fed1db7'],
            sinceBlock: 21712806,
          },
        ],
      },
    ],
  },
  daBridge: {
    name: 'Enshrined Bridge',
    daLayer: ProjectId('ethereum'),
    technology: {
      description: readProjectMarkdown('ethereum', 'daBridgeTechnology'),
    },
    usedIn: linkByDA({
      layer: ProjectId('ethereum'),
      bridge: ProjectId('ethereum'),
    }),
    risks: {
      daBridge: EthereumDaBridgeRisks.Enshrined,
      callout: readProjectMarkdown('ethereum', 'daBridgeCallout'),
    },
  },
  chainConfig: {
    name: 'ethereum',
    chainId,
    explorerUrl: 'https://etherscan.io',
    coingeckoPlatform: 'ethereum',
    sinceTimestamp: MIN_TIMESTAMP_FOR_TVL,
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 14353601,
        version: '3',
      },
      {
        sinceBlock: 12336033,
        batchSize: 150,
        address: EthereumAddress('0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696'),
        version: '2',
      },
      {
        sinceBlock: 7929876,
        batchSize: 150,
        address: EthereumAddress('0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441'),
        version: '1',
      },
    ],
    apis: [
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://eth.blockscout.com/api/v2' },
      { type: 'rpc', url: 'https://ethereum-rpc.publicnode.com' },
    ],
  },
  milestones: [
    {
      title: 'Blob throughput increase',
      url: 'https://eips.ethereum.org/EIPS/eip-7691',
      date: '2025-05-07T00:00:00Z',
      description:
        'Pectra hardfork increases blob limits: target from 3 to 6 blobs and max from 6 to 9 blobs.',
      type: 'general',
    },
    {
      title: 'BPO1 blob throughput increase',
      url: 'https://blog.ethereum.org/2025/11/06/fusaka-mainnet-announcement',
      date: '2025-12-09T00:00:00Z',
      description:
        'First Blob Parameter Only fork after Fusaka increases blob limits: target from 6 to 10 blobs and max from 9 to 15 blobs.',
      type: 'general',
    },
    {
      title: 'BPO2 blob throughput increase',
      url: 'https://github.com/ethereum/pm/issues/1772',
      date: '2026-01-07T00:00:00Z',
      description:
        'Second Blob Parameter Only fork increases blob limits: target from 10 to 14 blobs and max from 15 to 21 blobs.',
      type: 'general',
    },
  ],
  activityConfig: { type: 'block', startBlock: 8929324 },
}
