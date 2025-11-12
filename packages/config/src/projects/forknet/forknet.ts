import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
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

const discovery = new ProjectDiscovery('forknet')
const bridge = discovery.getContract('AgglayerBridge')

export const forknet: ScalingProject = {
  capability: 'universal',
  addedAt: UnixTime(1756724480), // 2025-09-01T12:01:20Z
  proofSystem: undefined,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  badges: [BADGES.DA.CustomDA, BADGES.Infra.Agglayer],
  id: ProjectId('forknet'),
  type: 'layer2',
  display: {
    name: 'Forknet',
    slug: 'forknet',
    description:
      'An onchain order book DEX for spot and perpetuals, built on CDK OP Stack and natively integrated with Agglayer for unified liquidity.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://forknet.io/'],
      bridges: ['https://bridge.forknet.io/'],
      explorers: ['https://forkscan.org'],
      socialMedia: ['https://x.com/forknet_io'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  chainConfig: {
    name: 'forknet',
    chainId: 8338,
    explorerUrl: 'https://forkscan.org',
    sinceTimestamp: UnixTime(1756893611),
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet-rpc-1.forknet.io',
        callsPerMinute: 300,
      },
    ],
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: bridge.address,
        tokens: '*',
        sinceTimestamp: UnixTime(1756893611),
        sharedEscrow: {
          type: 'AggLayer',
          nativeAsset: 'etherPreminted',
          premintedAmount: '340282366920938463463374607431768211455',
        },
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
      adjustCount: { type: 'SubtractOne' },
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      description:
        "Currently the system permits invalid state roots. 'Pessimistic' proofs only validate the bridge accounting.",
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: {
    stage: 'NotApplicable',
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
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    zkProgramHashes: getPessimisticVKeys().map((el) => ZK_PROGRAM_HASHES(el)),
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  milestones: [
    {
      title: 'Forknet Launch',
      url: 'https://x.com/forknet_io/status/1971221046377234734',
      date: '2024-09-25',
      description: 'Forknet is live on mainnet, integrated with Agglayer.',
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
