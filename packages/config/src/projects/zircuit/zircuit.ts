import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  ESCROW,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ZK_PROGRAM_HASHES } from '../../common/zkProgramHashes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import {
  explorerReferences,
  safeGetImplementation,
} from '../../templates/utils'
import type { ProjectScalingStateValidationCategory } from '../../types'

const discovery = new ProjectDiscovery('zircuit')

const ZIRCUIT_FINALIZATION_PERIOD_SECONDS: number =
  discovery.getContractValue<number>(
    'L2OutputOracle',
    'FINALIZATION_PERIOD_SECONDS',
  )

// the opstack template automatically applies the correct risk rosette slices, so we do not override them
// as soon as this is not the case anymore (backdoor removed, permissionless proposing etc.),
// we should update the opstack.ts or not use it anymore
const ZIRCUIT_STATE_VALIDATION: ProjectScalingStateValidationCategory = {
  title: 'Validity proofs',
  description:
    'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
  risks: [
    {
      category: 'Funds can be stolen if',
      text: 'the validity proof cryptography is broken or implemented incorrectly.',
    },
    {
      category: 'Funds can be frozen if',
      text: 'the SP1VerifierGateway is unable to route proof verification to a valid verifier.',
    },
  ],
  references: [
    {
      title: 'VerifierV3 (SP1VerifierGateway) - Etherscan source code',
      url: 'https://etherscan.io/address/0xf35A4088eA0231C44B9DB52D25c0E9E2fEe31f67#code',
    },
  ],
}

const sequencerAddress = ChainSpecificAddress(
  discovery.getContractValue('SystemConfig', 'batcherHash'),
)
const sequencerInbox = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'sequencerInbox',
)
const inboxStartBlock =
  discovery.getContractValueOrUndefined<number>('SystemConfig', 'startBlock') ??
  0
const sequencer = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'batcherHash',
)
const timeLimitOutputRootSubmissionSeconds = discovery.getContractValue<number>(
  'L2OutputOracle',
  'timeLimitOutputRootSubmissionSeconds',
)
const portal = discovery.getContract('OptimismPortal')
const l2OutputOracle = discovery.getContract('L2OutputOracle')
const explorerUrl = 'https://explorer.zircuit.com'

const zircuitProgramHashes = []
zircuitProgramHashes.push(
  discovery.getContractValue<string>('L2OutputOracle', 'aggregationVkey'),
)
zircuitProgramHashes.push(
  discovery.getContractValue<string>('L2OutputOracle', 'rangeVkeyCommitment'),
)

const genesisTimestamp = UnixTime(1719936217)

export const zircuit: ScalingProject = {
  id: ProjectId('zircuit'),
  addedAt: UnixTime(1712559704), // 2024-04-08T07:01:44Z
  badges: [BADGES.VM.EVM, BADGES.DA.EthereumBlobs, BADGES.Stack.OPStack],
  capability: 'universal',
  type: 'layer2',
  display: {
    name: 'Zircuit',
    slug: 'zircuit',
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    description:
      'Zircuit is a universal ZK Rollup. It is based on the Optimism Bedrock architecture, employing AI to identify and stop malicious transactions at the sequencer level.',
    links: {
      websites: ['https://zircuit.com/'],
      bridges: ['https://bridge.zircuit.com/', 'https://app.zircuit.com/'],
      documentation: ['https://docs.zircuit.com/'],
      explorers: ['https://explorer.zircuit.com/'],
      repositories: ['https://github.com/zircuit-labs'],
      socialMedia: [
        'https://x.com/ZircuitL2',
        'https://discord.com/invite/zircuit',
        'https://zircuit.com/blog',
        'https://t.me/zircuitl2_bot',
      ],
      other: ['https://rollup.codes/zircuit'],
    },
    architectureImage: 'zircuit',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Zircuit is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root is settled ${formatSeconds(
        ZIRCUIT_FINALIZATION_PERIOD_SECONDS,
      )} after it has been posted.`,
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
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
      rollupNodeLink: 'https://github.com/zircuit-labs/l2-geth-public',
    },
  ),
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
      executionDelay: ZIRCUIT_FINALIZATION_PERIOD_SECONDS,
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      description:
        RISK_VIEW.SEQUENCER_NO_MECHANISM().description +
        ' The L2 code has been modified to allow the sequencer to explicitly censor selected L1->L2 transactions.',
    },
    proposerFailure: {
      value: 'Use escape hatch',
      sentiment: 'warning',
      orderHint: Number.NEGATIVE_INFINITY,
      description: `Users are able to trustlessly exit by submitting a Merkle proof of funds after ${formatSeconds(timeLimitOutputRootSubmissionSeconds)} with no new state proposals have passed. The escape of ETH and ERC-20 balances is permissionless while the escape of DeFi contract balances is trusted.`,
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('sp1'),
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  stateValidation: {
    categories: [ZIRCUIT_STATE_VALIDATION],
  },
  config: {
    associatedTokens: ['ZRC'],
    activityConfig: {
      // zircuit does not have a system transaction in every block but in every 5th/6th, so we do not subtract those and overcount
      type: 'block',
      startBlock: 1,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: inboxStartBlock,
        inbox: ChainSpecificAddress.address(sequencerInbox),
        sequencers: [ChainSpecificAddress.address(sequencer)],
      },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x92Ef6Af472b39F1b363da45E35530c24619245A4',
          ),
          selector: '0xa9efd6b8',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber, bytes _proof)',
          sinceTimestamp: UnixTime(1720137600),
          untilTimestamp: UnixTime(1741654919),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: ChainSpecificAddress.address(sequencerAddress),
          to: ChainSpecificAddress.address(sequencerInbox),
          sinceTimestamp: genesisTimestamp,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
          { type: 'liveness', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x92Ef6Af472b39F1b363da45E35530c24619245A4',
          ),
          selector: '0x1bf75d29',
          functionSignature:
            'function proposeL2OutputV2(uint256 _batchIndex, bytes32 _batchHash, bytes32 _poseidonPostStateRoot, bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber, bytes _aggrProof) payable',
          sinceTimestamp: UnixTime(1741654919),
          untilTimestamp: UnixTime(1756148051),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
          { type: 'liveness', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x92Ef6Af472b39F1b363da45E35530c24619245A4',
          ),
          selector: '0x76340d0a',
          functionSignature:
            'function proposeL2OutputV3(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof, address _proverAddress) payable',
          sinceTimestamp: UnixTime(1756148051),
        },
      },
    ],
    escrows: [
      // non-template escrows
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x912C7271a6A3622dfb8B218eb46a6122aB046C79',
        ),
        tokens: ['wstETH'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description:
          'custom wstETH Vault controlled by Lido governance, using the canonical bridge for messaging.',
      }),
      // template escrows
      discovery.getEscrowDetails({
        includeInTotal: true,
        address: portal.address,
        tokens: ['ETH'],
        premintedTokens: [],
        description: 'Main entry point for users depositing ETH.',
        upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
      }),
      discovery.getEscrowDetails({
        includeInTotal: true,
        address: discovery.getContract('L1StandardBridge').address,
        tokens: '*',
        premintedTokens: ['ZRC'],
        excludedTokens: ['rswETH', 'rsETH'],
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
        upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
      }),
    ],
  },
  chainConfig: {
    name: 'zircuit',
    chainId: 48900,
    gasTokens: ['ETH'],
    coingeckoPlatform: 'zircuit',
    sinceTimestamp: UnixTime(1719936217),
    apis: [
      {
        type: 'rpc',
        url: 'https://zircuit1-mainnet.p2pify.com/',
        callsPerMinute: 300,
      },
      {
        type: 'rpc',
        url: 'https://zircuit1-mainnet.liquify.com/',
        callsPerMinute: 300,
      },
      {
        type: 'rpc',
        url: 'https://zircuit-mainnet.drpc.org/',
        callsPerMinute: 300,
      },
      {
        type: 'sourcify',
        chainId: 48900,
      },
    ],
    explorerUrl,
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    zkProgramHashes: zircuitProgramHashes.map((el) => ZK_PROGRAM_HASHES(el)),
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          title: 'Derivation: Batch submission - OP Mainnet specs',
          url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
        },
        ...explorerReferences(explorerUrl, [
          {
            title: 'BatchInbox - address',
            address: ChainSpecificAddress.address(sequencerInbox),
          },
          {
            title: `${portal.name}.sol - source code, depositTransaction function`,
            address: safeGetImplementation(portal),
          },
        ]),
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        OPERATOR.CENTRALIZED_OPERATOR.description +
        ' The L2 code has been modified to allow the sequencer to explicitly censor selected L1->L2 transactions.',
      references: [
        {
          title: 'L1Block.sol - Sourcify explorer source code',
          url: 'https://repo.sourcify.dev/48900/0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      references: [
        {
          title: 'Sequencing Window - OP Mainnet Specs',
          url: 'https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
        },
        ...explorerReferences(explorerUrl, [
          {
            title: `${portal.name}.sol - source code, depositTransaction function`,
            address: safeGetImplementation(portal),
          },
        ]),
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING(
          'optimistic',
          discovery.getContractValue<number>(
            l2OutputOracle.name ?? l2OutputOracle.address,
            'FINALIZATION_PERIOD_SECONDS',
          ),
        ),
        references: explorerReferences(explorerUrl, [
          {
            title: `${portal.name}.sol - source code, proveWithdrawalTransaction function`,
            address: safeGetImplementation(portal),
          },
          {
            title: `${portal.name}.sol - source code, finalizeWithdrawalTransaction function`,
            address: safeGetImplementation(portal),
          },
          {
            title: 'L2OutputOracle.sol - source code, PROPOSER check',
            address: safeGetImplementation(l2OutputOracle),
          },
        ]),
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
      {
        ...EXITS.FORCED_MESSAGING('all-messages'),
        risks: [
          {
            category: 'Users can be censored if',
            text: 'the operator explicitly censors their forced transaction, possible through a modification in the smart contracts.',
          },
        ],
        references: [
          {
            title: 'Forced withdrawal from an OP Stack blockchain',
            url: 'https://docs.optimism.io/stack/transactions/forced-transaction',
          },
        ],
      },
      {
        name: 'Escape mechanism',
        description: `Zircuit employs a custom escape mechanism that can help users exit the system in certain situations. If the operator disappears or is down for more than ${formatSeconds(timeLimitOutputRootSubmissionSeconds)}, users can submit a merkle proof to the L1 contracts to withdraw any ETH or ERC-20 balance they have on L2. L2 DeFi contracts and their deployers can manually distribute their pooled L2 balance using 'Resolver' contracts on L1 in case of an escape. In contrast to individual account escapes, the redistribution of these contract balances to users is permissioned.`,
        references: [
          {
            title: 'Etherscan - OptimismPortal - escapeEth() function',
            url: 'https://etherscan.io/address/0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1',
          },
        ],
        risks: [],
      },
    ],
    otherConsiderations: [
      {
        name: 'EVM compatible smart contracts are supported',
        description:
          'OP stack chains are pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on L2.',
        risks: [],
        references: [
          {
            title: 'Introducing EVM Equivalence',
            url: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
          },
        ],
      },
    ],
  },
  milestones: [
    {
      title: 'Proof system migrated to SP1',
      date: '2025-08-25T00:00:00.00Z',
      description:
        'Zircuit deprecates its in-house proof system in favor of SP1.',
      type: 'general',
      url: 'https://etherscan.io/address/0xf35A4088eA0231C44B9DB52D25c0E9E2fEe31f67',
    },
    {
      title: 'Escape mechanism',
      url: 'https://www.zircuit.com/blog/mainnet-phase-1-is-live',
      date: '2025-08-05T00:00:00.00Z',
      description: 'Zircuit introduces a custom escape mechanism.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://www.zircuit.com/blog/mainnet-phase-1-is-live',
      date: '2024-08-05T00:00:00.00Z',
      description: 'Zircuit is live on mainnet.',
      type: 'general',
    },
  ],
}
