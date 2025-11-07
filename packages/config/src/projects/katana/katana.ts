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
  DATA_ON_CHAIN,
  EXITS,
  FORCE_TRANSACTIONS,
  RISK_VIEW,
  SEQUENCER_NO_MECHANISM,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ZK_PROGRAM_HASHES } from '../../common/zkProgramHashes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('katana')
const upgradeDelayString = formatSeconds(
  discovery.getContractValue<number>('Timelock', 'getMinDelay'),
)
const emergencyActivatedCount = discovery.getContractValue<number>(
  'AgglayerManager',
  'emergencyStateCount',
)
const katanaVKeys = getKatanaVKeys()

export const katana: ScalingProject = {
  id: ProjectId('katana'),
  type: 'layer2',
  capability: 'universal',
  addedAt: UnixTime(1749119953),
  badges: [
    BADGES.VM.EVM,
    BADGES.DA.EthereumBlobs,
    BADGES.RaaS.Conduit,
    BADGES.Infra.Agglayer,
    BADGES.Stack.OPSuccinct,
  ],
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  display: {
    name: 'Katana',
    slug: 'katana',
    description:
      'Katana is a Layer 2 specializing on DeFi. Its unique architecture combines an OP stack base with Agglayer shared bridge interoperability and OP-Succinct SP1 validity proofs.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK', 'OP Stack'],
    upgradesAndGovernanceImage: 'agglayer-algateway',
    links: {
      websites: ['https://katana.network/'],
      bridges: [
        'https://app.katana.network/',
        'https://bridge.katana.network/',
      ],
      explorers: ['https://katanascan.com'],
      repositories: ['https://github.com/agglayer'],
      documentation: [
        'https://docs.katana.network/',
        'https://docs.agglayer.dev/',
      ],
      socialMedia: [
        'https://x.com/katana',
        'https://discord.com/invite/KatanaNetwork',
        'https://reddit.com/r/katana/',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('sp1'),
  },
  config: {
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: EthereumAddress('0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a'),
          to: EthereumAddress('0x000d4411cdeb152378626B5C5E33fd5D6808939a'),
          sinceTimestamp: UnixTime(1746742811),
        },
      },
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'liveness',
            subtype: 'proofSubmissions',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x100d3ca4f97776A40A7D93dB4AbF0FEA34230666',
          ),
          selector: '0x9ee4afa3',
          functionSignature: 'function onVerifyPessimistic(bytes aggchainData)',
          sinceTimestamp: UnixTime(1746742811),
        },
      },
    ],
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 22441925,
        inbox: EthereumAddress('0x000d4411cdeb152378626B5C5E33fd5D6808939a'),
        sequencers: [
          EthereumAddress('0x1FFDA89C755f6D4Af069897D77CcAbb580Fd412a'),
        ],
      },
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
      adjustCount: { type: 'SubtractOne' },
    },
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe',
        ),
        tokens: '*',
        sharedEscrow: {
          type: 'AggLayer',
          nativeAsset: 'etherPreminted',
          premintedAmount: '340282366920938463463374607431768211455',
        },
      }),
    ],
  },
  chainConfig: {
    name: 'katana',
    chainId: 747474,
    coingeckoPlatform: 'katana',
    explorerUrl: 'https://katanascan.com',
    sinceTimestamp: UnixTime(1746742811),
    apis: [
      { type: 'rpc', url: 'https://rpc.katana.network', callsPerMinute: 300 },
      { type: 'blockscout', url: 'https://katanascan.com/api' },
    ],
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
      executionDelay: 0, // state root is published together with the pessimistic proof
    },
    dataAvailability: DATA_ON_CHAIN,
    exitWindow: {
      value: 'None',
      description: `Even though there is a ${upgradeDelayString} Timelock for upgrades, forced transactions are disabled.`,
      sentiment: 'bad',
      orderHint: -1, // worse than forced tx available but instantly upgradable
      warning: {
        value: 'The Security Council can remove the delay on upgrades.',
        sentiment: 'bad',
      },
    },
    // no node source available, assuming the op stack standard SEQUENCING_WINDOW_SECONDS is not configured
    sequencerFailure: SEQUENCER_NO_MECHANISM(false),
    // sequencerFailure: {
    //   ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(SEQUENCING_WINDOW_SECONDS),
    //   secondLine: formatDelay(SEQUENCING_WINDOW_SECONDS),
    // },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
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
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: false,
      delayWith30DExitWindow: false,
    },
  }),
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  stateValidation: {
    categories: [
      {
        title: 'Prover Architecture',
        description:
          "Katana uses the Agglayer CDK in CDK-opgeth-zkrollup configuration. This combines an OP-Succinct zk rollup base with Agglayer shared bridge interoperability. Both parts are verified in a single nested proof using the Succinct Sp1Verifier. This proof is called the pessimistic proof by Agglayer which contains 1) the bridge accounting proof proving only the secure accounting of the Agglayer shared bridge and can have 2) a reference to an 'aggchain proof', which can define additional programs to be proven. In the case of Katana, these are the op-succinct block range proofs as an aggregated proof proving the state transitions of the L2.",
        references: [
          {
            url: 'https://docs.agglayer.dev/cdk/cdk-opgeth/architecture/#cdk-opgeth-zkrollup-not-live-yet',
            title: 'CDK-opgeth-zkrollup architecture',
          },
        ],
      },
      {
        title: 'Validity proofs',
        description:
          'Each update to the rollup state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
        references: [
          {
            url: 'https://succinctlabs.github.io/op-succinct/architecture.html',
            title: 'Op-Succinct architecture',
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the state transition validity proof cryptography is broken or implemented incorrectly.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'A malicious state transition is finalized by activating the permissioned optimistic mode.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the proposer routes proof verification through a malicious or faulty verifier by specifying an unsafe route id.',
          },
          {
            category: 'Funds can be frozen if',
            text: 'the AggLayerGateway is unable to route proof verification to a valid verifier.',
          },
        ],
      },
      {
        title: 'Pessimistic Proofs',
        description:
          'The pessimistic proofs that are used to prove correct accounting in the Agglayer shared bridge (minimum security guarantee) are using the [SP1 zkVM by Succinct](https://github.com/succinctlabs/sp1).',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the pessimistic proof cryptography is broken or implemented incorrectly.',
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
          url: 'https://etherscan.io/address/0x000d4411cdeb152378626B5C5E33fd5D6808939a',
          title: 'batchInbox - Etherscan address',
        },
      ],
      risks: [],
    },
    operator: {
      name: 'The system has a centralized operator',
      description:
        'Only a trusted sequencer is allowed to submit transaction batches. A mechanism for users to submit their own batches is currently disabled. Only a trusted proposer can propose and prove new state roots.',
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'the permissioned proposer fails to publish state roots to the L1.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'the permissioned sequencer fails to publish transaction data to the L1.',
        },
      ],
      references: [
        {
          url: 'https://etherscan.io/address/0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174#readProxyContract#F13',
          title: 'batcherHash - Etherscan address',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      description:
        'The mechanism for allowing users to submit their own transactions is currently disabled.',
      references: [
        {
          url: 'https://etherscan.io/address/0x51c852eC17062FB229A117Cb8abCBc7Eb171D5Bc#code#F1#L578',
          title:
            '_depositTransaction() in OptimismPortal2 - Etherscan source code',
        },
      ],
    },
    exitMechanisms: [EXITS.REGULAR_MESSAGING('zk')],
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
  upgradesAndGovernance: `
The regular upgrade process for all system contracts (shared and L2-specific) starts at the PolygonAdminMultisig. For the shared contracts, they schedule a transaction that targets the ProxyAdmin via the Timelock, wait for ${upgradeDelayString} and then execute the upgrade. An upgrade of the Layer 2 specific rollup- or validium contract requires first adding a new rollupType through the Timelock and the AgglayerManager (defining the new implementation and verifier contracts). Now that the rollupType is created, either the local admin or the PolygonAdminMultisig can immediately upgrade the local system contracts to it.

The PolygonSecurityCouncil can expedite the upgrade process by declaring an emergency state. This state pauses both the shared bridge and the AgglayerManager and allows for instant upgrades through the timelock. Accordingly, instant upgrades for all system contracts are possible with the cooperation of the SecurityCouncil. The emergency state has been activated ${emergencyActivatedCount} time(s) since inception.

Furthermore, the PolygonAdminMultisig is permissioned to manage the shared trusted aggregator (proposer and prover) for all participating Layer 2s, deactivate the emergency state, obsolete rolupTypes and manage operational parameters and fees in the AgglayerManager directly. The local admin of a specific Layer 2 can manage their chain by choosing the trusted sequencer, manage forced batches and set the data availability config. Creating new Layer 2s (of existing rollupType) is outsourced to the PolygonCreateRollupMultisig but can also be done by the PolygonAdminMultisig. Finally, it can manage SP1 verification keys for pessimistic proofs and aggchain proofs, which defines the affected chains' state validation. Custom non-shared bridge escrows have their custom upgrade admins listed in the permissions section.`,

  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the contracts or their dependencies (e.g. AggLayerGateway) receive a malicious code upgrade. There is no delay on upgrades.',
      },
    ],
    zkProgramHashes: katanaVKeys.map((el) => ZK_PROGRAM_HASHES(el)),
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  milestones: [
    {
      title: 'Katana Launch',
      url: 'https://x.com/katana/status/1939808602727813253',
      date: '2025-07-01T00:00:00Z',
      description: 'Katana is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
}

function getKatanaVKeys(): string[] {
  const vKeys: string[] = []
  const opSuccinctConfig = discovery.getContractValue<{
    [key: string]: string
  }>('AggchainFEP', 'selectedOpSuccinctConfig')
  vKeys.push(opSuccinctConfig['aggregationVkey'])
  vKeys.push(opSuccinctConfig['rangeVkeyCommitment'])
  // If default gateway is used, aggchain program hashes are taken from AggLayerGateway
  // Otherwise they are taken from AggchainFEP itself
  type ProgramHashDict = Record<string, Record<string, string>[]>
  const useDefaultVkeys = discovery.getContractValue<boolean>(
    'AggchainFEP',
    'useDefaultVkeys',
  )
  const aggchainVKeyDict = useDefaultVkeys
    ? discovery.getContractValue<ProgramHashDict>(
        'AgglayerGateway',
        'aggchainVKeys',
      )
    : discovery.getContractValue<ProgramHashDict>(
        'AggchainFEP',
        'aggregationVkey',
      )
  const pessimisticVKeyDict = discovery.getContractValue<ProgramHashDict>(
    'AgglayerGateway',
    'routes',
  )

  // Iterate over all selectors, each of the selectors could be used as it is set in calldata
  const aggchainVKeys = Object.values(aggchainVKeyDict).flatMap((arr) =>
    arr.map((el) => el['newVKey']),
  )
  const pessimisticVKeys = Object.values(pessimisticVKeyDict).flatMap((arr) =>
    arr.map((el) => el['pessimisticVKey']),
  )
  return vKeys.concat(aggchainVKeys).concat(pessimisticVKeys)
}
