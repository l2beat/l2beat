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

const discovery = new ProjectDiscovery('xlayer')
const bridge = discovery.getContract('AgglayerBridge')

export const xlayer: ScalingProject = {
  addedAt: UnixTime(1713983341), // 2024-04-24T18:29:01Z
  badges: [BADGES.DA.CustomDA, BADGES.Infra.Agglayer],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    REASON_FOR_BEING_OTHER.NO_PROOFS,
  ],
  proofSystem: undefined,
  display: {
    name: 'X Layer',
    slug: 'xlayer',
    description:
      'X Layer is a Layer 2 by OKX with seamless integration with OKX products. It is powered by the Polygon CDK.',
    links: {
      websites: ['https://okx.com/xlayer'],
      documentation: [
        'https://web3.okx.com/xlayer/docs/users/welcome/about-x-layer',
      ],
      explorers: ['https://okx.com/explorer/xlayer'],
      socialMedia: ['https://twitter.com/XLayerOfficial'],
      bridges: ['https://web3.okx.com/xlayer/bridge'],
      repositories: ['https://github.com/okx/xlayer-erigon'],
    },
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
  },
  dataAvailability: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    mode: { value: 'None' },
  },
  config: {
    associatedTokens: ['OKB'],
    escrows: [
      discovery.getEscrowDetails({
        address: bridge.address,
        tokens: '*',
        sinceTimestamp: UnixTime(1712620800),
        sharedEscrow: {
          type: 'AggLayer',
          nativeAsset: 'etherWrapped',
          wethAddress: EthereumAddress(
            '0x5a77f1443d16ee5761d310e38b62f77f726bc71c',
          ),
          tokensToAssignFromL1: ['OKB'],
        },
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  chainConfig: {
    name: 'xlayer',
    chainId: 196,
    explorerUrl: 'https://rpc.xlayer.tech',
    gasTokens: ['OKB'],
    sinceTimestamp: UnixTime(1711782180),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 47416,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.xlayer.tech',
        callsPerMinute: 300,
      },
    ],
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
  milestones: [
    {
      title: 'Migration to Pessimistic Proofs',
      url: 'https://etherscan.io/tx/0xab579dbf426db0badfaef925504105088f3300b51f1362a4084c57d7e13c0fb1#eventlog',
      date: '2025-08-05',
      description:
        'X Layer stops validating the full L2 state and moves to bridge accounting proofs.',
      type: 'general',
    },
    {
      title: 'X Layer Public Launch',
      url: 'https://x.com/XLayerOfficial/status/1780056275898048562',
      date: '2024-04-16',
      description: 'X Layer is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
  type: 'layer2',
  id: ProjectId('xlayer'),
  capability: 'universal',
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
