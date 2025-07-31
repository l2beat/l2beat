import {
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  DATA_ON_CHAIN,
  EXITS,
  FRONTRUNNING_RISK,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatDelay, formatExecutionDelay } from '../../common/formatDelays'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { safeGetImplementation } from '../../templates/utils'

const discovery = new ProjectDiscovery('phala')

const finalizationPeriod = discovery.getContractValue<number>(
  'OPSuccinctL2OutputOracle',
  'finalizationPeriodSeconds',
)

const sequencerAddress = ChainSpecificAddress(
  discovery.getContractValue('SystemConfig', 'batcherHash'),
)

const sequencerInbox = ChainSpecificAddress(
  discovery.getContractValue('SystemConfig', 'sequencerInbox'),
)

const portal = discovery.getContract('OptimismPortal')
const l2OutputOracle = discovery.getContract('OPSuccinctL2OutputOracle')
const upgradeDelay = 0
const forcedWithdrawalDelay = 0
const SEQUENCING_WINDOW_SECONDS = 3600 * 12

export const phala: ScalingProject = {
  id: ProjectId('phala'),
  capability: 'universal',
  addedAt: UnixTime(1734388655), // Dec-16-2024 10:37:35 PM UTC
  display: {
    name: 'Phala',
    slug: 'phala',
    description: `Phala is cloud computing protocol which aims at offering developers a secure and efficient platform for deploying and managing AI-ready applications in a trusted environment (TEE).
      Phala rollup on Ethereum leverages the Op-Succinct stack, a combination of OP stack contracts and Zero-Knowledge Proofs (ZK) using the SP1 zkVM.`,
    category: 'ZK Rollup',
    purposes: ['Universal'],
    links: {
      websites: ['https://phala.network/'],
      documentation: ['https://docs.phala.network/'],
      explorers: ['https://explorer.phala.network'],
      repositories: ['https://github.com/Phala-Network/'],
      socialMedia: [
        'https://x.com/PhalaNetwork',
        'https://discord.com/invite/phala-network',
        'https://t.me/phalanetwork',
        'https://phala.network/blog',
      ],
    },
    liveness: {
      warnings: {
        stateUpdates:
          'Please note, the state is not finalized until the finalization period passes.',
      },
      explanation: `Phala is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets confirmed ${formatSeconds(
        finalizationPeriod,
      )} after it has been posted.`,
    },
  },
  chainConfig: {
    name: 'phala',
    chainId: 2035,
    explorerUrl: 'https://explorer.phala.network',
    sinceTimestamp: UnixTime.fromDate(new Date('2024-12-16T22:14:09Z')),
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'blockscout',
        url: 'https://explorer.phala.network/api',
      },
      {
        type: 'rpc',
        url: 'https://rpc.phala.network/',
        callsPerMinute: 1500,
      },
    ],
  },
  config: {
    associatedTokens: ['PHA'],
    activityConfig: {
      type: 'block',
      startBlock: 1,
      adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 1 },
    },
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521',
        ),
        sinceTimestamp: UnixTime(1734388655),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A',
        ),
        sinceTimestamp: UnixTime(1734388655),
        tokens: ['ETH'],
      }),
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: ChainSpecificAddress.address(sequencerAddress),
          to: ChainSpecificAddress.address(sequencerInbox),
          sinceTimestamp: UnixTime(1734388655),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: ChainSpecificAddress.address(l2OutputOracle.address),
          selector: '0x9ad84880',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof)',
          sinceTimestamp: UnixTime(1734388655),
          untilTimestamp: UnixTime(1746606971),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: ChainSpecificAddress.address(l2OutputOracle.address),
          selector: '0x59c3e00a', // non-optimistic mode
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof, address _proverAddress)',
          sinceTimestamp: UnixTime(1746606971),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: ChainSpecificAddress.address(l2OutputOracle.address),
          selector: '0x9aaab648', // optimistic mode
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber)',
          sinceTimestamp: UnixTime(1746606971),
        },
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  badges: [BADGES.VM.EVM, BADGES.DA.EthereumBlobs, BADGES.RaaS.Conduit],
  type: 'layer2',
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      secondLine: formatExecutionDelay(finalizationPeriod),
    },
    dataAvailability: {
      ...DATA_ON_CHAIN,
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, forcedWithdrawalDelay),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(SEQUENCING_WINDOW_SECONDS),
      secondLine: formatDelay(SEQUENCING_WINDOW_SECONDS),
    },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
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
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/succinctlabs/op-succinct/',
    },
  ),
  stateValidation: {
    categories: [
      {
        title: 'Validity proofs',
        description: `Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.
        Through the SuccinctL2OutputOracle, the system also allows to switch to an optimistic mode, in which no proofs are required and a challenger can challenge the proposed output state root within the finalization period.`,
        references: [
          {
            url: 'https://succinctlabs.github.io/op-succinct/architecture.html',
            title: 'Op-Succinct architecture',
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'in non-optimistic mode, the validity proof cryptography is broken or implemented incorrectly.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'optimistic mode is enabled and no challenger checks the published state.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the proposer routes proof verification through a malicious or faulty verifier by specifying an unsafe route id.',
          },
          {
            category: 'Funds can be frozen if',
            text: 'the permissioned proposer fails to publish state roots to the L1.',
          },
          {
            category: 'Funds can be frozen if',
            text: 'in non-optimistic mode, the SuccinctGateway is unable to route proof verification to a valid verifier.',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          url: 'https://etherscan.io/address/0x5a2a0698355d06cd5c4e3872d2bc6b9f6a89d39b',
          title: 'BatchInbox - Etherscan address',
        },
      ],
      risks: [],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          title:
            'SuccinctL2OutputOracle.sol - Etherscan source code, CHALLENGER address',
          url: `https://etherscan.io/address/${safeGetImplementation(
            l2OutputOracle,
          )}#code`,
        },
        {
          title:
            'SuccinctL2OutputOracle.sol - Etherscan source code, PROPOSER address',
          url: `https://etherscan.io/address/${safeGetImplementation(
            l2OutputOracle,
          )}#code`,
        },
      ],
      risks: [FRONTRUNNING_RISK],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_YIELDING('zk', finalizationPeriod),
        references: [
          {
            title:
              'OptimismPortal.sol - Etherscan source code, proveWithdrawalTransaction function',
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
          {
            title:
              'OptimismPortal.sol - Etherscan source code, finalizeWithdrawalTransaction function',
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
          {
            title:
              'SuccinctL2OutputOracle.sol - Etherscan source code, PROPOSER check',
            url: `https://etherscan.io/address/${safeGetImplementation(
              l2OutputOracle,
            )}#code`,
          },
        ],
        risks: [],
      },
    ],
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the contracts or their dependencies (e.g. SuccinctGateway) receive a malicious code upgrade. There is no delay on upgrades.',
      },
    ],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  milestones: [
    {
      title: 'Plonky3 vulnerability patch',
      url: 'https://x.com/SuccinctLabs/status/1929773028034204121',
      date: '2025-06-04T00:00:00.00Z',
      description:
        'SP1 verifier is patched to fix critical vulnerability in Plonky3 proof system (SP1 dependency).',
      type: 'incident',
    },
    {
      title: 'Phala Network Launch',
      url: 'https://x.com/PhalaNetwork/status/1877052813383184606',
      date: '2025-01-08T00:00:00Z',
      description: 'Phala Network is live on Ethereum mainnet.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
