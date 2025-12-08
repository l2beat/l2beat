import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
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

const discovery = new ProjectDiscovery('polygonzkevm')
const bridge = discovery.getContract('AgglayerBridge')

const chainId = 1101

export const polygonzkevm: ScalingProject = {
  capability: 'universal',
  addedAt: UnixTime(1679651674), // 2023-03-24T09:54:34Z
  proofSystem: undefined,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    REASON_FOR_BEING_OTHER.NO_PROOFS,
  ],
  badges: [BADGES.DA.CustomDA, BADGES.Infra.Agglayer],
  id: ProjectId('polygonzkevm'),
  type: 'layer2',
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    description: 'Polygon zkEVM is an EVM-compatible L2 built by Polygon Labs.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      bridges: ['https://portal.polygon.technology/bridge'],
      documentation: ['https://docs.polygon.technology/zkEVM/'],
      explorers: ['https://zkevm.polygonscan.com/'],
      repositories: [
        'https://github.com/0xPolygon/zkevm-node',
        'https://github.com/0xPolygon/',
      ],
      socialMedia: [
        'https://x.com/0xPolygon',
        'https://t.me/polygonofficial',
        'https://reddit.com/r/0xPolygon/',
        'https://discord.com/invite/0xPolygonCommunity',
        'https://discord.com/invite/0xpolygonRnD',
        'https://polygon.technology/blog',
      ],
      other: [
        'https://rollup.codes/polygon-zkevm',
        'https://growthepie.com/chains/polygon-zkevm',
      ],
    },
  },
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
  config: {
    associatedTokens: ['POL', 'MATIC'],
    escrows: [
      discovery.getEscrowDetails({
        address: bridge.address,
        tokens: '*',
        sharedEscrow: {
          type: 'AggLayer',
          nativeAsset: 'etherPreminted',
          premintedAmount: '200000000000000000000000000',
        },
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB',
        ),
        tokens: ['USDC'],
        description:
          'Custom Bridge escrow for USDC bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01',
        ),
        tokens: ['wstETH'],
        description:
          'Custom Bridge escrow for wstETH bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98',
        ),
        tokens: ['DAI', 'sDAI'],
        description:
          'Custom Bridge escrow for DAI bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  chainConfig: {
    name: 'polygonzkevm',
    chainId,
    explorerUrl: 'https://zkevm.polygonscan.com',
    coingeckoPlatform: 'polygon-zkevm',
    sinceTimestamp: UnixTime(1679679015),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 57746,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://polygon-rpc.com/zkevm',
        callsPerMinute: 500,
      },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://zkevm.blockscout.com/api/v2' },
    ],
  },
  milestones: [
    {
      title: 'Migration to Pessimistic Proofs',
      url: 'https://etherscan.io/tx/0xd8eb9f7bf7594d047e0c8b254b3893eb05daf692b1688adaacd21af144efe2a5#eventlog',
      date: '2025-12-03',
      description:
        'Polygon zkEVM stops validating the full L2 state and moves to bridge accounting proofs.',
      type: 'general',
    },
    {
      title: 'Polygon zkEVM Etrog upgrade',
      url: 'https://docs.polygon.technology/zkEVM/architecture/protocol/etrog-upgrade/#etrog-upgrade',
      date: '2024-02-13',
      description: 'Polygon zkEVM is upgraded to the Polygon Etrog version.',
      type: 'general',
    },
    {
      title: 'Polygon zkEVM Mainnet Beta is Live',
      url: 'https://polygon.technology/blog/polygon-zkevm-mainnet-beta-is-live?utm_source=twitter&utm_medium=social&utm_campaign=zkevm-launch&utm_term=mainnet-beta-live&utm_content=blog',
      date: '2023-03-27T00:00:00Z',
      description: 'Polygon zkEVM public beta launched.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
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
