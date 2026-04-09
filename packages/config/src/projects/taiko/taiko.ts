import type { ContractValue } from '@l2beat/discovery'
import {
  ChainSpecificAddress,
  // assert,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
  // formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  DATA_ON_CHAIN,
  FRONTRUNNING_RISK,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { PROGRAM_HASHES } from '../../common/programHashes'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getSP1Verifiers } from '../../templates/opStack'

const discovery = new ProjectDiscovery('taiko')

const mainnetInboxAddress = ChainSpecificAddress.address(
  discovery.getContract('MainnetInbox').address,
)
const preShastaInboxAddress = EthereumAddress(
  '0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a',
)
const mainnetInboxActivationTimestamp = UnixTime(
  discovery.getContractValue<number>('MainnetInbox', 'activationTimestamp'),
)
const mainnetInboxSourceUrl =
  'https://etherscan.io/address/0x6f21C543a4aF5189eBdb0723827577e1EF57ef1f#code'
const proverWhitelistSourceUrl =
  'https://etherscan.io/address/0xEa798547d97e345395dA071a0D7ED8144CD612Ae#code'

interface MainnetInboxConfig extends Record<string, ContractValue> {
  minBond: number
  livenessBond: number
  provingWindow: number
  permissionlessProvingDelay: number
  forcedInclusionDelay: number
  permissionlessInclusionMultiplier: number
}

const mainnetInboxConfig = discovery.getContractValue<MainnetInboxConfig>(
  'MainnetInbox',
  'getConfig',
)

const forcedInclusionPermissionlessDelay =
  mainnetInboxConfig.forcedInclusionDelay *
  mainnetInboxConfig.permissionlessInclusionMultiplier

const whitelistedOperatorsCount = discovery.getContractValue<number>(
  'PreconfWhitelist',
  'operatorCount',
)
const whitelistedProverCount = discovery.getContractValue<number>(
  'ProverWhitelist',
  'proverCount',
)

const chainId = 167000

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
    // BADGES.Other.BasedSequencing, // NOTE: add this back when preconfs whitelist is removed
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  proofSystem: undefined,
  display: {
    name: 'Taiko Alethia',
    slug: 'taiko',
    stacks: ['Taiko'],
    description:
      'Taiko Alethia is an Ethereum-equivalent rollup on the Ethereum network. Taiko aims at combining based sequencing and a multi-proof system through SP1, RISC0 and TEEs.',
    purposes: ['Universal'],
    links: {
      websites: ['https://taiko.xyz'],
      bridges: ['https://bridge.taiko.xyz/'],
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
      other: [
        'https://rollup.codes/taiko',
        'https://growthepie.com/chains/taiko',
      ],
    },
    liveness: {
      explanation:
        'Taiko posts proposals containing one or more L2 blocks to Ethereum using blobs. For a transaction to be considered final, the proposal containing it has to be proven on L1. State updates happen in two steps: proposals are submitted to MainnetInbox and later proven on L1.',
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
        inbox: mainnetInboxAddress,
        sequencers: [],
        topics: [
          '0x7c4c4523e17533e451df15762a093e0693a2cd8b279fe54c6cd3777ed5771213', // Proposed
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
          address: preShastaInboxAddress,
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
          address: preShastaInboxAddress,
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
          address: preShastaInboxAddress,
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
          address: preShastaInboxAddress,
          selector: '0x47faad14',
          functionSignature:
            'function proposeBatch(bytes _params, bytes _txList) returns (tuple(bytes32 txsHash, tuple(uint16 numTransactions, uint8 timeShift, bytes32[] signalSlots)[] blocks, bytes32[] blobHashes, bytes32 extraData, address coinbase, uint64 proposedIn, uint64 blobCreatedIn, uint32 blobByteOffset, uint32 blobByteSize, uint32 gasLimit, uint64 lastBlockId, uint64 lastBlockTimestamp, uint64 anchorBlockId, bytes32 anchorBlockHash, tuple(uint8 adjustmentQuotient, uint8 sharingPctg, uint32 gasIssuancePerSecond, uint64 minGasExcess, uint32 maxGasIssuancePerBlock) baseFeeConfig) info_, tuple(bytes32 infoHash, address proposer, uint64 batchId, uint64 proposedAt) meta_)',
          topics: [
            '0x9eb7fc80523943f28950bbb71ed6d584effe3e1e02ca4ddc8c86e5ee1558c096', //BatchProposed
          ],
          sinceTimestamp: UnixTime(1747823664),
          untilTimestamp: mainnetInboxActivationTimestamp,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: preShastaInboxAddress,
          selector: '0xc939ac47',
          functionSignature:
            'function proposeBatchWithExpectedLastBlockId(bytes _params, bytes _txList, uint96 _expectedLastBlockId) returns (tuple(bytes32 infoHash, address proposer, uint64 batchId, uint64 proposedAt) meta_, uint64 lastBlockId_)',
          topics: [
            '0x9eb7fc80523943f28950bbb71ed6d584effe3e1e02ca4ddc8c86e5ee1558c096', //BatchProposed
          ],
          sinceTimestamp: UnixTime(1756244927),
          untilTimestamp: mainnetInboxActivationTimestamp,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: mainnetInboxAddress,
          selector: '0x9791e644',
          functionSignature: 'function propose(bytes _lookahead, bytes _data)',
          topics: [
            '0x7c4c4523e17533e451df15762a093e0693a2cd8b279fe54c6cd3777ed5771213', // Proposed
          ],
          sinceTimestamp: mainnetInboxActivationTimestamp,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: preShastaInboxAddress,
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
          address: preShastaInboxAddress,
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
          address: preShastaInboxAddress,
          selector: '0xc9cc2843',
          functionSignature:
            'function proveBatches(bytes _params, bytes _proof)',
          topics: [
            '0xc99f03c7db71a9e8c78654b1d2f77378b413cc979a02fa22dc9d39702afa92bc', //BatchesProved
          ],
          sinceTimestamp: UnixTime(1747815696),
          untilTimestamp: mainnetInboxActivationTimestamp,
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: preShastaInboxAddress,
          selector: '0x0cc62b42',
          functionSignature: 'function verifyBatches(uint64 _length)',
          sinceTimestamp: UnixTime(1747823664),
          untilTimestamp: mainnetInboxActivationTimestamp,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: mainnetInboxAddress,
          selector: '0xea191743',
          functionSignature: 'function prove(bytes _data, bytes _proof)',
          topics: [
            '0xa274dcaff3629ec7d69d144038e97732516ff306fcbf8a2bc9423d106779a2f0', // Proved
          ],
          sinceTimestamp: mainnetInboxActivationTimestamp,
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
      description: `A multi-proof system is used. There are four verifiers available: SGX (Geth), SGX (Reth), SP1 and RISC0. Two of them must be used to prove a proposal range, and SGX (Geth) is mandatory. The end state root is supplied during the \`prove\` call and is checked against the accompanying SGX/zkVM proof. Proving is currently gated by ProverWhitelist, which has ${whitelistedProverCount} whitelisted prover${whitelistedProverCount === 1 ? '' : 's'} in discovery, and becomes permissionless only after an unproven proposal is > ${formatSeconds(mainnetInboxConfig.permissionlessProvingDelay)} old.`,
      sentiment: 'bad',
      value: 'Multi-proofs',
      executionDelay: 0,
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
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
      forcedInclusionPermissionlessDelay,
    ),
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(
        mainnetInboxConfig.permissionlessProvingDelay,
      ),
      description: `Anyone can propose after ${formatSeconds(forcedInclusionPermissionlessDelay)} if forced inclusions are ignored, and proving becomes permissionless after ${formatSeconds(mainnetInboxConfig.permissionlessProvingDelay)} if a proposal remains unproven.`,
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
        noRedTrustedSetups: true,
        programHashesReproducible: false,
        proverSourcePublished: true,
        verifierContractsReproducible: null,
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
        description: `Taiko uses a multi-proof system to validate state transitions. The system requires two proofs among four available verifiers: SGX (Geth), SGX (Reth), SP1, and RISC0. The use of SGX (Geth) is mandatory, while the other three can be used interchangeably. This means that a proposal range can be proven without providing a ZK proof if SGX (Geth) and SGX (Reth) are used together. New proposals target a proof submission cadence of ${formatSeconds(mainnetInboxConfig.provingWindow)}. Proving is currently centralized behind ProverWhitelist with ${whitelistedProverCount} whitelisted prover${whitelistedProverCount === 1 ? '' : 's'}. Non-whitelisted actors must wait ${formatSeconds(mainnetInboxConfig.permissionlessProvingDelay)} before the whitelist is dropped, and MainnetInbox currently sets minBond=${mainnetInboxConfig.minBond} and livenessBond=${mainnetInboxConfig.livenessBond}. The multi-proof system allows detecting bugs in the verifiers if they produce different results for the same proposal range. If such a bug is detected, the system gets automatically paused.`,
        references: [
          {
            title:
              'MainnetInbox.sol - Etherscan source code, getConfig function',
            url: mainnetInboxSourceUrl,
          },
          {
            title: 'MainnetInbox.sol - Etherscan source code, prove function',
            url: mainnetInboxSourceUrl,
          },
          {
            title: 'ProverWhitelist.sol - Etherscan source code',
            url: proverWhitelistSourceUrl,
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
      name: 'The system uses whitelist-based sequencing and proving',
      description: `The system uses a whitelist-based sequencing mechanism to allow for fast preconfirmations on the L2. On the L1, whitelisted preconfirmers can propose Taiko L2 data to the MainnetInbox contract.
        The whitelist is managed by the \`PreconfWhitelist\` contract, which currently has ${whitelistedOperatorsCount} active operators registered.
        Forced inclusions become mandatory after ${formatSeconds(mainnetInboxConfig.forcedInclusionDelay)} and proposing becomes permissionless after ${formatSeconds(forcedInclusionPermissionlessDelay)} if the queue is still ignored.
        Proving is controlled separately by \`ProverWhitelist\`, which currently has ${whitelistedProverCount} whitelisted prover${whitelistedProverCount === 1 ? '' : 's'}.
        Non-whitelisted actors must wait ${formatSeconds(mainnetInboxConfig.permissionlessProvingDelay)} after an unproven proposal before the whitelist is dropped. MainnetInbox currently sets minBond=${mainnetInboxConfig.minBond} and livenessBond=${mainnetInboxConfig.livenessBond}.
        Currently, proving a proposal requires SGX (Geth), plus either SGX (Reth), SP1, or RISC0.`,
      references: [
        {
          title: 'MainnetInbox.sol - Etherscan source code, propose function',
          url: mainnetInboxSourceUrl,
        },
        {
          title: 'MainnetInbox.sol - Etherscan source code, prove function',
          url: mainnetInboxSourceUrl,
        },
        {
          title: 'PreconfWhitelist.sol - Etherscan source code',
          url: 'https://etherscan.io/address/0xDBae46E35C18719E6c78aaBF9c8869c4eC84c149#code',
        },
        {
          title: 'ProverWhitelist.sol - Etherscan source code',
          url: proverWhitelistSourceUrl,
        },
      ],
      risks: [FRONTRUNNING_RISK],
    },
    forceTransactions: {
      name: 'Users can force any transaction via L1',
      description: `Users can submit a blob reference containing a standalone transaction by calling the \`saveForcedInclusion()\` function on the \`MainnetInbox\` contract.
        Once any forced inclusion has been queued for ${formatSeconds(mainnetInboxConfig.forcedInclusionDelay)}, whitelisted proposers cannot submit new proposals unless they process all due forced inclusions.
        If the oldest queued forced inclusion is still ignored for ${formatSeconds(forcedInclusionPermissionlessDelay)}, proposing becomes permissionless and anyone can include it.`,
      references: [
        {
          title:
            'MainnetInbox.sol - Etherscan source code, saveForcedInclusion function',
          url: mainnetInboxSourceUrl,
        },
        {
          title: 'MainnetInbox.sol - Etherscan source code, propose function',
          url: mainnetInboxSourceUrl,
        },
      ],
      risks: [],
    },
    exitMechanisms: [
      // TODO: double check exit mechanism
      {
        name: 'Regular exit',
        description:
          'The user initiates the withdrawal by submitting a regular transaction on this chain. When the block containing that transaction is finalized the funds become available for withdrawal on L1. Finally the user submits an L1 transaction to claim the funds. This transaction requires a merkle proof.',
        risks: [],
        references: [],
      },
    ],
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    programHashes: getTaikoVKeys().map((el) => PROGRAM_HASHES(el)),
    zkVerifiers: getVerifiers(),
  },
  permissions: discovery.getDiscoveredPermissions(),
  milestones: [
    {
      title: 'Preconfs introduction',
      url: 'https://taiko.mirror.xyz/rbgD_KM06QkDe1t0Gw1wI_MLvwobTS1PqEIfstZRo48',
      date: '2025-08-11T00:00:00.00Z',
      description:
        'Taiko implements preconfs - whitelisted actors provide fast soft confirmations for L2 txs.',
      type: 'general',
    },
    {
      title: 'Plonky3 vulnerability patch',
      url: 'https://x.com/SuccinctLabs/status/1929773028034204121',
      date: '2025-06-04T00:00:00.00Z',
      description:
        'SP1 verifier is patched to fix critical vulnerability in Plonky3 proof system (SP1 dependency).',
      type: 'incident',
    },
    {
      title: 'Taiko Pacaya Hardfork',
      url: 'https://taiko.mirror.xyz/pIchmo0E-DfSySCzL52BFbus54Z3XJEO0k0Ptqqpm_I',
      date: '2025-05-21T00:00:00.00Z',
      description:
        'Taiko Pacaya hardfork replaces the contestable rollup design with a batch based protocol.',
      type: 'general',
    },
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
    {
      title: 'Taiko enabled SP1 and Risc0 proving',
      url: 'https://etherscan.io/tx/0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd',
      date: '2024-11-01T00:00:00.00Z',
      description:
        'TaikoL1 smart contract upgraded to verify SP1 and Risc0 proofs of Taiko L2 blocks.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}

function getTaikoVKeys(): string[] {
  const sp1Programs = discovery.getContractValue<string[]>(
    'TaikoSP1Verifier',
    'trustedPrograms',
  )
  return sp1Programs.concat(
    discovery.getContractValue<string[]>('TaikoRisc0Verifier', 'trustedImages'),
  )
}

function getVerifiers(): ChainSpecificAddress[] {
  const result: ChainSpecificAddress[] = getSP1Verifiers(discovery)
  result.push(discovery.getContract('RiscZeroGroth16Verifier').address)
  return result
}
