import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { DA_BRIDGES, DA_LAYERS, DA_MODES, RISK_VIEW } from '../../common'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('lighter')

const priorityExpiration = discovery.getContractValue<number>(
  'Lighter',
  'PRIORITY_EXPIRATION',
)

export const lighter: ScalingProject = {
  id: ProjectId('lighter'),
  type: 'layer2',
  capability: 'universal',
  addedAt: UnixTime(1711551933), // 2024-03-27T15:05:33Z
  display: {
    name: 'Lighter',
    slug: 'lighter',
    description:
      'Lighter is an application-specific zk rollup on a mission to revolutionize trading by building provably fair, secure, and scalable infrastructure for finance.',
    purposes: ['Universal', 'Exchange'],
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://lighter.xyz', 'https://app.lighter.xyz/'],
      explorers: ['https://scan.lighter.xyz'],
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
  discoveryInfo: getDiscoveryInfo([discovery]),
}
