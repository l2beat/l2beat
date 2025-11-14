import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ZK_PROGRAM_HASHES } from '../../common/zkProgramHashes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('haust')
const bridge = discovery.getContract('AgglayerBridge')

export const haust: ScalingProject = {
  id: ProjectId('haust'),
  capability: 'universal',
  addedAt: UnixTime(1736600180), // 2024-11-12T10:56:20Z
  badges: [BADGES.DA.CustomDA, BADGES.Infra.Agglayer],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    REASON_FOR_BEING_OTHER.NO_PROOFS,
  ],
  display: {
    name: 'Haust Network',
    slug: 'haust',
    description:
      'Haust Network is a Layer 2 blockchain built on the Polygon CDK, integrating with the Agglayer and Account Abstraction from the outset.',
    purposes: ['Exchange'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://haust.network/'],
      documentation: ['https://docs.haust.network/'],
      explorers: ['https://haustscan.com/'],
      repositories: ['https://github.com/Haust-Labs'],
      bridges: ['https://haustbridge.com'],
      socialMedia: [
        'https://x.com/HaustNetwork',
        'https://t.me/haustnetwork',
        'https://discord.gg/QWGxjTXD8N',
        'https://medium.com/@haustnetwork',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: undefined,
  dataAvailability: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    mode: { value: 'None' },
  },
  config: {
    associatedTokens: ['HAUST'],
    escrows: [
      discovery.getEscrowDetails({
        address: bridge.address,
        tokens: '*',
        sinceTimestamp: UnixTime(1756808195),
        sharedEscrow: {
          type: 'AggLayer',
          nativeAsset: 'etherWrapped',
          wethAddress: EthereumAddress(
            '0x5a77f1443d16ee5761d310e38b62f77f726bc71c',
          ),
          tokensToAssignFromL1: ['HAUST'],
          // currently uses a bad custom .json config for HAUST TVS that only counts the WHAUST on L2 because circ supply is unknown and there is a massive premint/-bridge on L1/L2 and the rpc censors the preminted balance
        },
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  chainConfig: {
    name: 'haust',
    chainId: 3864,
    explorerUrl: 'https://haustscan.com',
    gasTokens: ['HAUST'],
    sinceTimestamp: UnixTime(1756808195),
    apis: [
      {
        type: 'rpc',
        url: 'https://haust-network-rpc.eu-north-2.gateway.fm',
        callsPerMinute: 300,
      },
    ],
  },
  stage: {
    stage: 'NotApplicable',
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      description:
        "Currently the system permits invalid state roots. 'Pessimistic' proofs only validate the bridge accounting.",
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    zkProgramHashes: getPessimisticVKeys().map((el) => ZK_PROGRAM_HASHES(el)),
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  technology: {
    otherConsiderations: [
      {
        name: 'Shared bridge and Pessimistic Proofs',
        description:
          "Polygon Agglayer uses a shared bridge escrow for Rollups, Validiums and external chains that opt in to participate in interoperability. Each participating chain needs to provide zk proofs to access any assets in the shared bridge. In addition to the full execution proofs that are used for the state validation of Rollups and Validiums, accounting proofs over the bridges state (Polygon calls them 'Pessimistic Proofs') are used by external chains ('cdk-sovereign' and aggchains). Using the SP1 zkVM by Succinct, projects without a full proof system on Ethereum or custom proof systems are able to share the bridge with the zkEVM Agglayer projects.",
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the accounting proof system for the bridge (pessimistic proofs, SP1) is implemented incorrectly.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the operator manipulates the L2 state, which is not validated on Ethereum.',
            isCritical: true,
          },
        ],
        references: [
          {
            title: 'Pessimistic Proof - Polygon Knowledge Layer',
            url: 'https://docs.polygon.technology/learn/agglayer/pessimistic_proof',
          },
          {
            title:
              'Etherscan: AgglayerManager.sol - verifyPessimisticTrustedAggregator() function',
            url: 'https://etherscan.io/address/0x15cAF18dEd768e3620E0f656221Bf6B400ad2618#code#F1#L1300',
          },
        ],
      },
    ],
  },
  milestones: [
    {
      title: 'Haust Public Launch',
      url: 'https://x.com/HaustNetwork/status/1982805150260666681',
      date: '2025-09-27',
      description: 'Haust is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
  type: 'layer2',
}

function getPessimisticVKeys(): string[] {
  type ProgramHashDict = Record<string, Record<string, string>[]>
  const pessimisticVKeyDict = discovery.getContractValue<ProgramHashDict>(
    'AgglayerGateway',
    'routes',
  )
  // Iterate over all selectors, each of the selectors could be used as it is set in calldata
  return Object.values(pessimisticVKeyDict).flatMap((arr) =>
    arr.map((el) => el['pessimisticVKey']),
  )
}
