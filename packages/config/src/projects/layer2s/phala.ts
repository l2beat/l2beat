import {
  type ContractParameters,
  get$Implementations,
} from '@l2beat/discovery-types'
import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  DATA_ON_CHAIN,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FRONTRUNNING_RISK,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { formatDelay, formatExecutionDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { getStage } from './common/stages/getStage'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './templates/generateDiscoveryDrivenSections'

const discovery = new ProjectDiscovery('phala')

function safeGetImplementation(contract: ContractParameters): string {
  const implementation = get$Implementations(contract.values)[0]
  if (!implementation) {
    throw new Error(`No implementation found for ${contract.name}`)
  }
  return implementation.toString()
}

const finalizationPeriod = discovery.getContractValue<number>(
  'OPSuccinctL2OutputOracle',
  'finalizationPeriodSeconds',
)

const sequencerAddress = EthereumAddress(
  discovery.getContractValue('SystemConfig', 'batcherHash'),
)

const sequencerInbox = EthereumAddress(
  discovery.getContractValue('SystemConfig', 'sequencerInbox'),
)

const portal = discovery.getContract('OptimismPortal')
const l2OutputOracle = discovery.getContract('OPSuccinctL2OutputOracle')
const upgradeDelay = 0
const forcedWithdrawalDelay = 0
const SEQUENCING_WINDOW_SECONDS = 3600 * 12

export const phala: Layer2 = {
  id: ProjectId('phala'),
  capability: 'universal',
  addedAt: new UnixTime(1734388655), // Dec-16-2024 10:37:35 PM UTC
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
    finality: { finalizationPeriod: finalizationPeriod },
  },
  chainConfig: {
    name: 'phala',
    chainId: 2035,
    explorerUrl: 'https://explorer.phala.network',
    explorerApi: {
      url: 'https://explorer.phala.network/api',
      type: 'blockscout',
    },
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-12-16T22:14:09Z')),
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521'),
        sinceTimestamp: new UnixTime(1734388655),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A'),
        sinceTimestamp: new UnixTime(1734388655),
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
          from: sequencerAddress,
          to: sequencerInbox,
          sinceTimestamp: new UnixTime(1734388655),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: l2OutputOracle.address,
          selector: '0x9ad84880',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof)',
          sinceTimestamp: new UnixTime(1734388655),
        },
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  badges: [Badge.VM.EVM, Badge.DA.EthereumBlobs, Badge.RaaS.Conduit],
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
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: false,
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
  technology: {
    stateCorrectness: {
      name: 'Validity proofs ensure state correctness',
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
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          url: 'https://succinctlabs.github.io/op-succinct/architecture.html',
          title: 'Op-Succinct architecture',
        },
      ],
      risks: [],
    },
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
        text: `the contracts or their dependencies (e.g. SuccinctGateway) receive a malicious code upgrade. There is no delay on upgrades.`,
      },
    ],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  milestones: [
    {
      title: 'Phala Network Launch',
      url: 'https://x.com/PhalaNetwork/status/1877052813383184606',
      date: '2025-01-08T00:00:00Z',
      description: 'Phala Network is live on Ethereum mainnet.',
      type: 'general',
    },
  ],
}
