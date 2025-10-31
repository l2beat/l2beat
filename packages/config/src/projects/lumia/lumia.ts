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

const discovery = new ProjectDiscovery('lumia')
const bridge = discovery.getContract('AgglayerBridge')

export const lumia: ScalingProject = {
  addedAt: UnixTime(1718181773), // 2024-06-12T08:42:53Z
  badges: [BADGES.DA.CustomDA, BADGES.Infra.Agglayer],
  type: 'layer2',
  id: ProjectId('lumia'),
  capability: 'universal',
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    REASON_FOR_BEING_OTHER.NO_PROOFS,
  ],
  display: {
    name: 'Lumia Prism',
    slug: 'lumia',
    description:
      'Lumia is a sovereign Agglayer chain focusing on real world assets, restaking and account abstraction.',
    links: {
      websites: ['https://lumia.org/'],
      bridges: ['https://bridge.lumia.org/'],
      explorers: ['https://explorer.lumia.org/', 'https://lens.lumia.org/'],
      documentation: ['https://docs.lumia.org/'],
      repositories: [
        'https://github.com/orionprotocol/cdk-validium-permissionless-node',
      ],
      socialMedia: [
        'https://x.com/BuildOnLumia',
        'https://t.me/lumia_community',
        'https://discord.gg/Lumia',
      ],
    },
    purposes: ['Restaking', 'RWA', 'Universal'],
  },
  proofSystem: undefined,
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
  stage: {
    stage: 'NotApplicable',
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    zkProgramHashes: getPessimisticVKeys().map((el) => ZK_PROGRAM_HASHES(el)),
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  dataAvailability: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    mode: { value: 'None' },
  },
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
  config: {
    associatedTokens: ['LUMIA'],
    escrows: [
      discovery.getEscrowDetails({
        address: bridge.address,
        tokens: '*',
        sharedEscrow: {
          type: 'AggLayer',
          nativeAsset: 'etherWrapped',
          wethAddress: EthereumAddress(
            '0x5A77f1443D16ee5761d310e38b62f77f726bC71c',
          ),
          tokensToAssignFromL1: ['LUMIA'],
        },
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  chainConfig: {
    name: 'lumia',
    chainId: 994873017,
    gasTokens: ['LUMIA'],
    explorerUrl: 'https://explorer.lumia.org',
    sinceTimestamp: UnixTime(1719499031),
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet-rpc.lumia.org',
        callsPerMinute: 300,
      },
    ],
  },
  milestones: [
    {
      title: 'Migration to Pessimistic Proofs',
      url: 'https://etherscan.io/tx/0x4a9633f61bf7eacf4cfffefccc1e8a561fdaacfbed6470573463e28304b3906d#eventlog',
      date: '2025-10-02',
      description:
        'Lumia stops validating the full L2 state and moves to bridge accounting proofs.',
      type: 'general',
    },
    {
      title: 'Lumia Mainnet Launch',
      url: 'https://x.com/BuildOnLumia/status/1895133948096676276',
      date: '2025-02-27',
      description: 'Lumia is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
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
