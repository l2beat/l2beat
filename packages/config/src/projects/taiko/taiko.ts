import type { ContractValue } from '@l2beat/discovery'
import {
  assert,
  // assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
  // formatSeconds,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import {
  CONTRACTS,
  DATA_ON_CHAIN,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatExecutionDelay } from '../../common/formatDelays'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'

const discovery = new ProjectDiscovery('taiko')

const taikoL1ContractAddress = discovery.getContract('TaikoL1').address

interface PacayaConfig extends Record<string, ContractValue> {
  chainId: number
  maxUnverifiedBatches: number
  batchRingBufferSize: number
  maxBatchesToVerify: number
  blockMaxGasLimit: number

  livenessBondBase: string
  livenessBondPerBlock: string

  stateRootSyncInternal: number
  maxAnchorHeightOffset: number

  baseFeeConfig: {
    adjustmentQuotient: number
    sharingPctg: number
    gasIssuancePerSecond: number
    minGasExcess: number
    maxGasIssuancePerBlock: number
  }

  provingWindow: number
  cooldownWindow: number
  maxSignalsToReceive: number
  maxBlocksPerBatch: number

  forkHeights: {
    ontake: number
    pacaya: number
    shasta: number
    unzen: number
  }
}

const taikoChainConfig = discovery.getContractValue<PacayaConfig>(
  'TaikoL1',
  'pacayaConfig',
)

const livenessBond = utils.formatEther(taikoChainConfig.livenessBondBase)

const inclusionDelay = discovery.getContractValue<PacayaConfig>(
  'ForcedInclusionStore',
  'inclusionDelay',
)

const chainId = 167000

const preconfRouter = discovery.getContractValue(
  'TaikoWrapper',
  'preconfRouter',
)

assert(
  preconfRouter === '0x0000000000000000000000000000000000000000',
  'preconf router is set, update sequencing sections',
) // also check this line:         require(p.blocks[0].signalSlots.length == 0, InvalidSignalSlots());

export const taiko: ScalingProject = {
  id: ProjectId('taiko'),
  capability: 'universal',
  addedAt: UnixTime(1680768480), // 2023-04-06T08:08:00Z
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  badges: [
    BADGES.VM.EVM,
    BADGES.DA.EthereumBlobs,
    BADGES.Other.BasedSequencing,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Taiko Alethia',
    slug: 'taiko',
    stack: 'Taiko',
    description:
      'Taiko Alethia is an Ethereum-equivalent rollup on the Ethereum network. Taiko combines based sequencing and a multi-proof system through SP1, RISC0 and TEEs.',
    purposes: ['Universal'],
    category: 'ZK Rollup', // NOTE: will be moved to Others if they keep the ability not to use ZK proofs
    links: {
      websites: ['https://taiko.xyz'],
      apps: ['https://bridge.taiko.xyz/'],
      documentation: ['https://docs.taiko.xyz/'],
      explorers: ['https://taikoscan.io', 'https://taikoscan.network/'],
      repositories: ['https://github.com/taikoxyz'],
      socialMedia: [
        'https://twitter.com/taikoxyz',
        'https://discord.gg/taikoxyz',
        'https://taiko.mirror.xyz',
        'https://community.taiko.xyz',
        'https://youtube.com/@taikoxyz',
      ],
      rollupCodes: 'https://rollup.codes/taiko',
    },
    liveness: {
      explanation:
        'Taiko posts blocks of L2 transaction data directly to the L1. For a transaction to be considered final, both a block and its parent block have to be proven on the L1. State updates are a three step process: first blocks are proposed to L1, then they are proved, and lastly settled after a cooldown period.',
    },
  },
  config: {
    associatedTokens: ['TAIKO'],
    escrows: [
      {
        // Shared ETH bridge
        address: EthereumAddress('0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC'),
        sinceTimestamp: UnixTime(1714550603),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        // Shared ERC20 vault
        address: EthereumAddress('0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab'),
        sinceTimestamp: UnixTime(1714550603),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: '0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a',
        sequencers: [],
        topics: [
          '0xefe9c6c0b5cbd9c0eed2d1e9c00cfc1a010d6f1aff50f7facd665a639b622b26', // BlockProposedV2
          '0x9eb7fc80523943f28950bbb71ed6d584effe3e1e02ca4ddc8c86e5ee1558c096', // BatchProposed
        ],
      },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: taikoL1ContractAddress,
          selector: '0xef16e845',
          functionSignature:
            'function proposeBlock(bytes _params, bytes _txList) payable returns (tuple(bytes32 l1Hash, bytes32 difficulty, bytes32 blobHash, bytes32 extraData, bytes32 depositsHash, address coinbase, uint64 id, uint32 gasLimit, uint64 timestamp, uint64 l1Height, uint16 minTier, bool blobUsed, bytes32 parentMetaHash, address sender) meta_, tuple(address recipient, uint96 amount, uint64 id)[] deposits_)',
          sinceTimestamp: UnixTime(1716620627),
          untilTimestamp: UnixTime(1747823664), // last propose block
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: taikoL1ContractAddress,
          selector: '0x648885fb',
          functionSignature:
            'function proposeBlockV2(bytes _params, bytes _txList) returns (tuple meta_)',
          sinceTimestamp: UnixTime(1730602883),
          untilTimestamp: UnixTime(1747823664),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: taikoL1ContractAddress,
          selector: '0x0c8f4a10',
          functionSignature:
            'function proposeBlocksV2(bytes[] _paramsArr, bytes[] _txListArr) returns (tuple[] metaArr_)',
          sinceTimestamp: UnixTime(1730602883),
          untilTimestamp: UnixTime(1747823664),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: taikoL1ContractAddress,
          selector: '0x47faad14',
          functionSignature:
            'function proposeBatch(bytes _params, bytes _txList) returns (tuple(bytes32 txsHash, tuple(uint16 numTransactions, uint8 timeShift, bytes32[] signalSlots)[] blocks, bytes32[] blobHashes, bytes32 extraData, address coinbase, uint64 proposedIn, uint64 blobCreatedIn, uint32 blobByteOffset, uint32 blobByteSize, uint32 gasLimit, uint64 lastBlockId, uint64 lastBlockTimestamp, uint64 anchorBlockId, bytes32 anchorBlockHash, tuple(uint8 adjustmentQuotient, uint8 sharingPctg, uint32 gasIssuancePerSecond, uint64 minGasExcess, uint32 maxGasIssuancePerBlock) baseFeeConfig) info_, tuple(bytes32 infoHash, address proposer, uint64 batchId, uint64 proposedAt) meta_)',
          sinceTimestamp: UnixTime(1747823664),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: taikoL1ContractAddress,
          selector: '0x10d008bd',
          functionSignature:
            'function proveBlock(uint64 _blockId, bytes _input)',
          sinceTimestamp: UnixTime(1716620627),
          untilTimestamp: UnixTime(1747815696), // last prove block
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: taikoL1ContractAddress,
          selector: '0x440b6e18',
          functionSignature:
            'function proveBlocks(uint64[] _blockIds, bytes[] _inputs, bytes _batchProof)',
          sinceTimestamp: UnixTime(1730602883),
          untilTimestamp: UnixTime(1747815696),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: taikoL1ContractAddress,
          selector: '0xc9cc2843',
          functionSignature:
            'function proveBatches(bytes _params, bytes _proof)',
          sinceTimestamp: UnixTime(1747815696),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: taikoL1ContractAddress,
          selector: '0x0cc62b42',
          functionSignature: 'function verifyBatches(uint64 _length)',
          sinceTimestamp: UnixTime(1747823664),
        },
      },
    ],
  },
  chainConfig: {
    name: 'taiko',
    chainId,
    explorerUrl: 'https://taikoscan.io',
    sinceTimestamp: UnixTime(1716620627),
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mainnet.taiko.xyz',
        callsPerMinute: 500,
      },
      { type: 'etherscan', chainId },
    ],
  },
  type: 'layer2',
  riskView: {
    stateValidation: {
      description: `A multi-proof system is used. There are four verifiers available: SGX (Geth), SGX (Reth), SP1 and RISC0. Two of them must be used to prove a block, and SGX (Geth) is mandatory. A block can be proved without providing a ZK proof as SGX (Geth) + SGX (Reth) is a valid combination.`,
      sentiment: 'bad',
      value: 'Multi-proofs',
      secondLine: formatExecutionDelay(taikoChainConfig.cooldownWindow),
    },
    dataAvailability: {
      ...DATA_ON_CHAIN,
    },
    exitWindow: {
      description:
        'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
      sentiment: 'bad',
      value: 'None',
    },
    sequencerFailure: {
      description: `The system uses a based (or L1-sequenced) rollup sequencing mechanism, meaning that users can propose L2 blocks directly on the Taiko L1 contract. Proposers are required to also prove blocks within ${formatSeconds(taikoChainConfig.provingWindow)}, or forfeit half of their liveness bond (${livenessBond} TAIKO).`,
      sentiment: 'good',
      value: 'Self sequence',
    },
    proposerFailure: {
      description:
        RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS.description +
        ' Provers are required to submit two valid proofs for blocks, one of which must be SGX (Geth), and the other can be either SGX (Reth), SP1, or RISC0. If the proposer fails to prove the block within the proving window, they forfeit half of their liveness bond.',
      sentiment: 'good',
      value: 'Self propose',
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/taikoxyz/simple-taiko-node',
    },
  ),
  stateValidation: {
    categories: [
      {
        title: 'Validity proofs',
        description: `Taiko uses a multi-proof system to validate state transitions. The system requires two proofs among four available verifiers: SGX (Geth), SGX (Reth), SP1, and RISC0. The use of SGX (Geth) is mandatory, while the other three can be used interchangeably. This means that a block can be proven without providing a ZK proof if SGX (Geth) and SGX (Reth) are used together. Batch proposers are required to stake a liveness bond of ${livenessBond} TAIKO, half of which is forfeited if they fail to prove the block within the proving window of ${formatSeconds(taikoChainConfig.provingWindow)}. The multi-proof system allows to detect bugs in the verifiers if they produce different results for the same block. If such a bug is detected, the system gets automatically paused.`,
        references: [
          {
            title: 'TaikoL1.sol - Etherscan source code, liveness bond',
            url: 'https://etherscan.io/address/0x497B13f9192B09244de9b5F0964830969FB26F07#code',
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'a malicious block is proven by compromised SGX instances.',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      name: 'All data required for proofs is published on chain',
      description:
        'All the data that is used to construct the system state is published on chain in the form of blobs. This ensures that it will be available for enough time.',
      references: [],
      risks: [],
    },
    operator: {
      name: 'The system uses a based sequencing mechanism',
      description: `The system uses a based (or L1-sequenced) sequencing mechanism. Anyone can sequence Taiko L2 blocks by proposing them directly on the TaikoL1 contract.
        The proposer of a block is assigned the designated prover role, and will be the only entity allowed to provide a proof for the block during the ${formatSeconds(taikoChainConfig.provingWindow)} proving window.
        Currently, proving a block requires the block proposer to run a SGX instance with Geth, plus either SGX (Reth), SP1, or RISC0 to prove the block.
        Unless the block proposer proves the block within the proving window, it will forfeit half of its liveness bond to the TaikoL1 smart contract.`,
      references: [
        {
          title: 'TaikoL1.sol - Etherscan source code, proposeBatch function',
          url: 'https://etherscan.io/address/0x497B13f9192B09244de9b5F0964830969FB26F07#code',
        },
      ],
      risks: [],
    },
    forceTransactions: {
      name: `Users can force any transaction`,
      description: `The system is designed to allow users to propose L2 blocks directly on L1.
        Note that this would require the user to run two of the available proving systems, or forfeit half the liveness bond of ${livenessBond} TAIKO.
        Moreover, users can submit a blob containing a standalone transaction by calling the storeForcedInclusion() function on the ForcedInclusionStore contract. 
        This forced transaction mechanism allows users to submit a transaction without running a prover.
        This mechanism ensures that at least one forced transaction from the queue is processed every ${inclusionDelay} batches. However, if many transactions (k) are added to the queue, an individual transaction could experience a worst-case delay of up to k * ${inclusionDelay} batches while waiting for its turn.`,
      references: [],
      risks: [],
    },
    exitMechanisms: [
      // TODO: double check exit mechanism
      {
        name: 'Regular exit',
        description: `The user initiates the withdrawal by submitting a regular transaction on this chain. When the block containing that transaction is finalized the funds become available for withdrawal on L1. Finally the user submits an L1 transaction to claim the funds. This transaction requires a merkle proof.`,
        risks: [],
        references: [],
      },
    ],
  },
  contracts: {
    addresses: {
      [discovery.chain]: discovery.getDiscoveredContracts(),
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    [discovery.chain]: discovery.getDiscoveredPermissions(),
  },
  milestones: [
    {
      title: 'TAIKO Token Airdrop',
      url: 'https://taiko.mirror.xyz/VSOtILX2DQsc_6IMt5hBT1fEYSH8243pZ8IA_pBfHks',
      date: '2024-06-05T00:00:00.00Z',
      description: 'TAIKO token launches.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://taiko.mirror.xyz/Pizjv30FvjsZUwEG-Da7Gs6F8qeDLc4CKKEBqy3pTt8',
      date: '2024-05-27T00:00:00.00Z',
      description: 'Taiko is deployed on Ethereum mainnet.',
      type: 'general',
    },
    {
      title: 'Taiko Based Sequencing Upgrade',
      url: 'https://taiko.mirror.xyz/_oKlnpzKSOxGILyy4WlvpUmYEqD7BFxzmRo3XETlJqE',
      date: '2024-06-06T00:00:00.00Z',
      description: 'Proposing blocks on Taiko is now permissionless.',
      type: 'general',
    },
  ],
}
