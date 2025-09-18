import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FRONTRUNNING_RISK,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatDelay } from '../../common/formatDelays'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { safeGetImplementation } from '../../templates/utils'

const discovery = new ProjectDiscovery('mantle')

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

export const mantle: ScalingProject = {
  id: ProjectId('mantle'),
  capability: 'universal',
  addedAt: UnixTime(1680782525), // 2023-04-06T12:02:05Z
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Mantle',
    slug: 'mantle',
    description:
      'Mantle is a modular general-purpose Optimium with a protocol design philosophy that aims to offer users a less costly and more user-friendly experience, provide developers with a simpler and more flexible development environment, and deliver a comprehensive set of infrastructure for the next wave of mass-adopted dApps.',
    purposes: ['Universal'],
    links: {
      websites: ['https://mantle.xyz/'],
      bridges: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs-v2.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
    liveness: {
      warnings: {
        stateUpdates:
          'Please note, the state is not finalized until the finalization period passes.',
      },
      explanation: `Mantle is a ZK rollup that posts transaction data to EigenDA. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets confirmed ${formatSeconds(
        finalizationPeriod,
      )} after it has been posted.`,
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('sp1'),
  },
  chainConfig: {
    name: 'mantle',
    chainId: 5000,
    explorerUrl: 'https://explorer.mantle.xyz',
    sinceTimestamp: UnixTime(1688314886),
    gasTokens: ['MNT'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 304717,
        version: '3',
      },
    ],
    coingeckoPlatform: 'mantle',
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mantle.xyz',
        callsPerMinute: 1500,
      },
      {
        type: 'blockscout',
        url: 'https://explorer.mantle.xyz/api',
      },
    ],
  },
  config: {
    associatedTokens: ['MNT'],
    activityConfig: {
      type: 'block',
      startBlock: 1,
      adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 1 },
    },
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb',
        ),
        sinceTimestamp: UnixTime(1688314886),
        tokens: '*',
        excludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'FBTC'],
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012',
        ),
        sinceTimestamp: UnixTime(1688314886),
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
          sinceTimestamp: UnixTime(1688314886),
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
          sinceTimestamp: UnixTime(1688314886),
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
    daTracking: [
      {
        type: 'eigen-da',
        customerId: '0x24f0a3716805e8973bf48eb908d6d4a2f34af785',
        daLayer: ProjectId('eigenda'),
        sinceTimestamp: UnixTime(1738821600),
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.EIGEN_DA,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  badges: [BADGES.VM.EVM, BADGES.DA.EigenDA, BADGES.RaaS.Conduit],
  type: 'layer2',
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
      executionDelay: finalizationPeriod,
    },
    dataAvailability: RISK_VIEW.DATA_EIGENDA(true),
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
        callsItselfRollup: false,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: false,
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
      ...TECHNOLOGY_DATA_AVAILABILITY.EIGENDA_OFF_CHAIN(false),
      references: [
        {
          url:
            'https://etherscan.io/address/' +
            ChainSpecificAddress.address(sequencerInbox),
          title: 'BatchInbox - Etherscan address',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          title:
            'SuccinctL2OutputOracle.sol - Etherscan source code, proposeL2Output function',
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
      title: 'Upgrade to OP Succinct',
      url: 'https://x.com/Mantle_Official/status/1967936628678430965',
      date: '2025-09-16T00:00:00.00Z',
      description:
        'Mantle upgrades to OP Succinct, integrating ZK proofs for state validation.',
      type: 'general',
    },
    {
      title: 'Move to EigenDA',
      url: 'https://github.com/mantlenetworkio/mantle-v2/releases/tag/v1.1.1',
      date: '2025-03-19T00:00:00.00Z',
      description:
        'Mantle deactivates MantleDA and data availability migrates to EigenDA.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://www.mantle.xyz/blog/announcements/mantle-network-mainnet-alpha',
      date: '2023-07-14T00:00:00.00Z',
      description: 'Mantle is live on mainnet.',
      type: 'general',
    },
    {
      title: 'Mainnet v2 Tectonic Upgrade',
      url: 'https://www.mantle.xyz/blog/announcements/mantle-completes-mainnet-v2-tectonic-upgrade',
      date: '2024-03-15T00:00:00.00Z',
      description: 'Mantle completes Mainnet v2 Tectonic Upgrade.',
      type: 'general',
    },
    {
      title: 'MNT token migration begins',
      url: 'https://www.mantle.xyz/blog/announcements/bit-to-mnt-user-guide',
      date: '2023-07-11T00:00:00.00Z',
      description: 'Users can exchange their BIT tokens to MNT tokens.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
