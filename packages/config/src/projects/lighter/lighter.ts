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
  EXITS,
  FRONTRUNNING_RISK,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('lighter')

const priorityExpiration = discovery.getContractValue<number>(
  'Lighter',
  'PRIORITY_EXPIRATION',
)

const upgradeDelay = discovery.getContractValue<number>(
  'UpgradeGatekeeper',
  'approvedUpgradeNoticePeriod',
)

export const lighter: ScalingProject = {
  id: ProjectId('lighter'),
  type: 'layer2',
  capability: 'appchain',
  addedAt: UnixTime(1711551933), // 2024-03-27T15:05:33Z
  badges: [BADGES.VM.AppChain, BADGES.DA.EthereumBlobs],
  display: {
    warning:
      'Oct 8 2025: at the moment of writing, the circuits source code is not publicly available and therefore it is not possible to fully verify the business logic of the protocol. The team communicated to us that they plan to release them in the next 1-2 weeks.',
    name: 'Lighter',
    slug: 'lighter',
    description:
      'Lighter is an application-specific zk rollup on a mission to revolutionize trading by building provably fair, secure, and scalable infrastructure for finance.',
    purposes: ['Exchange'],
    links: {
      websites: ['https://lighter.xyz', 'https://app.lighter.xyz/'],
      explorers: [
        'https://app.lighter.xyz/explorer',
        'https://scan.lighter.xyz',
      ],
      documentation: [
        'https://docs.lighter.xyz',
        'https://assets.lighter.xyz/whitepaper.pdf',
      ],
      repositories: ['https://github.com/elliottech'],
      socialMedia: [
        'https://x.com/Lighter_xyz',
        'https://discord.gg/lighterxyz',
        'https://linkedin.com/company/lighter-xyz',
        'https://t.me/lighterxyz_official',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('lighterprover'),
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7',
        ),
        tokens: ['USDC'],
      }),
    ],
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 21642011, // https://etherscan.io/tx/0x228496195e6c4a6cdbf9fc3c153cce0fb652e5aeee5a4f0a966b16257ebb34b9
        inbox: EthereumAddress('0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7'),
        sequencers: [
          EthereumAddress('0xfDb36C132fA19f7774d72fA39c89272D1B954A41'),
          EthereumAddress('0xFBC0dcd6c3518cB529bC1B585dB992A7d40005fa'),
          EthereumAddress('0xfcB73F6405F6B9be91013d9477d81833a69C9c0D'),
          EthereumAddress('0x1c0F4f6daf0E0f32C5482672fa5342784915df21'),
        ],
      },
    ],
    trackedTxs: [
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'proofSubmissions',
          },
          {
            type: 'l2costs',
            subtype: 'proofSubmissions',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7',
          ),
          selector: '0x23ff50e1',
          functionSignature:
            'function verifyBatch(tuple(uint64 batchNumber, uint64 endBlockNumber, uint32 batchSize, uint64 startTimestamp, uint64 endTimestamp, uint32 priorityRequestCount, bytes32 prefixPriorityRequestHash, bytes32 onChainOperationsHash, bytes32 stateRoot, bytes32 validiumRoot, bytes32 commitment) batch, bytes proof)',
          sinceTimestamp: 1737090335, // Friday, January 17, 2025 5:05:35 AM
        },
      },
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7',
          ),
          selector: '0x2d320e28',
          functionSignature:
            'function executeBatches(tuple(uint64 batchNumber, uint64 endBlockNumber, uint32 batchSize, uint64 startTimestamp, uint64 endTimestamp, uint32 priorityRequestCount, bytes32 prefixPriorityRequestHash, bytes32 onChainOperationsHash, bytes32 stateRoot, bytes32 validiumRoot, bytes32 commitment)[] batches, bytes[] onChainOperationsPubData)',
          sinceTimestamp: 1737090335, // Friday, January 17, 2025 5:05:35 AM
        },
      },
    ],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, priorityExpiration),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(priorityExpiration),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
    },
    stage1: {
      principle: false,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: true,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    dataAvailability: {
      name: 'All data required for forced exits is published onchain',
      description:
        'All the data needed to recover the latest accounts state (represented by the Account Tree) and construct the zk proof necessary for forced exits is published onchain in the form of blobs. Only data that leads to state changes is posted.',
      risks: [],
      references: [],
    },
    operator: {
      name: 'Centralized operators',
      description:
        'Only the centralized operators can submit batches and verify them with a ZK proof, i.e. advance the state of the protocol.',
      risks: [FRONTRUNNING_RISK],
      references: [],
    },
    forceTransactions: {
      name: 'Users can force their transactions on L1',
      description: `If the centralized operators fail to include user transactions, users can force them themselves through L1. The possible transaction types that users can force are: deposits, withdrawals, order creation, order cancellation, and burning of pool shares. If the operators do not process forced transactions within ${formatSeconds(priorityExpiration)}, the system can be frozen (desert mode) and users can exit using the latest settled state. All open positions are settled using the latest index price.`,
      risks: [],
      references: [],
    },
    exitMechanisms: [
      EXITS.REGULAR_WITHDRAWAL('zk'),
      {
        name: 'Escape hatch through ZK proofs',
        description:
          'If the centralized operators fail to process forced transactions after the deadline, the system can be frozen (desert mode) and users can exit by reconstructing the latest settled state using the data available on L1 and providing a ZK proof of balance.',
        risks: [],
        references: [],
      },
    ],
    otherConsiderations: [
      {
        name: 'External oracles used for index prices',
        description:
          'Lighter uses a combination of oracles to determine index prices, with Stork as the primary source. External signatures are currently not verified and the sequencer must be trusted to truthfully report data.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the oracle prices are manipulated.',
          },
        ],
        references: [
          {
            title: 'Lighter docs - Fair Price Marking',
            url: 'https://docs.lighter.xyz/perpetual-futures/fair-price-marking',
          },
        ],
      },
    ],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  upgradesAndGovernance: `Regular upgrades are initiated by the "network governor" and executed with a ${formatSeconds(upgradeDelay)} delay. The "security council" is allowed to reduce the upgrade delay to zero in case of an emergency. The security council does not currently satify the Stage 1 requirements. The network governor also retains the ability to add or remove validators.`,
  contracts: {
    addresses: {
      ...discovery.getDiscoveredContracts(),
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ...discovery.getDiscoveredPermissions(),
  },
  milestones: [
    {
      title: 'Lighter experiences 4.5h of downtime',
      url: 'https://x.com/Lighter_xyz/status/1977252708533911614',
      date: '2025-10-10T00:00:00Z',
      description:
        'Lighter experiences 4.5 hours of downtime due to DB growth issues.',
      type: 'incident',
    },
    {
      title: 'Lighter launches public mainnet',
      url: 'https://x.com/Lighter_xyz/status/1973508660061180363',
      date: '2025-10-02T00:00:00Z',
      description:
        'Lighter launches public mainnet after 8 months of private beta.',
      type: 'general',
    },
  ],
}
