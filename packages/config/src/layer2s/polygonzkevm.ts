import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  makeBridgeCompatible,
  NUGGETS,
  RISK_VIEW,
  ScalingProjectPermissionedAccount,
  SEQUENCER_NO_MECHANISM,
  STATE_CORRECTNESS,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('polygonzkevm')
const upgradeDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)
const upgradeDelayString = formatSeconds(upgradeDelay)
const trustedAggregatorTimeout = discovery.getContractValue<number>(
  'PolygonRollupManager',
  'trustedAggregatorTimeout',
)
const trustedAggregatorTimeoutString = formatSeconds(trustedAggregatorTimeout)

const pendingStateTimeout = discovery.getContractValue<number>(
  'PolygonRollupManager',
  'pendingStateTimeout',
)
const pendingStateTimeoutString = formatSeconds(pendingStateTimeout)
const _HALT_AGGREGATION_TIMEOUT = formatSeconds(
  discovery.getContractValue<number>(
    'PolygonRollupManager',
    '_HALT_AGGREGATION_TIMEOUT',
  ),
)

const forceBatchTimeout = discovery.getContractValue<number>(
  'PolygonZkEVMExistentEtrog',
  'forceBatchTimeout',
)

/*
const bridgeEmergencyState = discovery.getContractValue<boolean>(
  'Bridge',
  'isEmergencyState',
)
const rollupEmergencyState = discovery.getContractValue<boolean>(
  'PolygonZkEvm',
  'isEmergencyState',
)
*/

const exitWindowRisk = {
  ...RISK_VIEW.EXIT_WINDOW(
    upgradeDelay,
    trustedAggregatorTimeout + pendingStateTimeout + forceBatchTimeout,
    0,
  ),
  description: `Even though there is a ${upgradeDelayString} Timelock for upgrades, forced transactions are disabled. Even if they were to be enabled, user withdrawals can be censored up to ${formatSeconds(
    trustedAggregatorTimeout + pendingStateTimeout + forceBatchTimeout,
  )}.`,
  warning: {
    text: 'The Security Council can upgrade with no delay.',
    sentiment: 'bad',
  },
} as const

const timelockUpgrades = {
  upgradableBy: ['AdminMultisig'],
  upgradeDelay: exitWindowRisk.value,
  upgradeConsiderations: exitWindowRisk.description,
}

const isForcedBatchDisallowed =
  discovery.getContractValue<string>(
    'PolygonZkEVMExistentEtrog',
    'forceBatchAddress',
  ) !== '0x0000000000000000000000000000000000000000'

const ESCROW_wstETH_ADDRESS = '0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01'
const ESCROW_USDC_ADDRESS = '0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB'
const ESCROW_DAI_ADDRESS = '0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98'

const roles = discovery.getContractValue<{
  TRUSTED_AGGREGATOR: { members: string[] }
}>('PolygonRollupManager', 'accessControl')

const aggregators: ScalingProjectPermissionedAccount[] =
  roles.TRUSTED_AGGREGATOR.members.map((address) =>
    discovery.formatPermissionedAccount(address),
  )

export const polygonzkevm: Layer2 = {
  type: 'layer2',
  id: ProjectId('polygonzkevm'),
  isUnderReview: true,
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    warning: 'The forced transaction mechanism is currently disabled.',
    description:
      'Polygon zkEVM is a EVM-compatible ZK Rollup built by Polygon Labs.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'Polygon',
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      apps: ['https://bridge.zkevm-rpc.com'],
      documentation: [
        'https://wiki.polygon.technology/docs/zkEVM/introduction',
      ],
      explorers: [
        'https://zkevm.polygonscan.com/',
        'https://explorer.mainnet.zkevm-test.net/',
      ],
      repositories: ['https://github.com/0xPolygonHermez'],
      socialMedia: [
        'https://twitter.com/0xPolygon',
        'https://discord.gg/XvpHAxZ',
        'https://polygon.technology/blog-tags/polygon-zk',
      ],
      rollupCodes: 'https://rollup.codes/polygon-zkevm',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      explanation:
        'Polygon zkEVM is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. State updates are a three step process: first blocks are committed to L1, then they are proved, and then it is possible to execute them.',
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe'),
        sinceTimestamp: new UnixTime(1679653127),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_wstETH_ADDRESS),
        sinceTimestamp: new UnixTime(1703945135),
        tokens: ['wstETH'],
        description: 'Escrow for wstETH',
        upgradableBy: ['EscrowAdmin'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_USDC_ADDRESS),
        sinceTimestamp: new UnixTime(1700125979),
        tokens: ['USDC'],
        description: 'Escrow for USDC',
        upgradableBy: ['EscrowAdmin'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_DAI_ADDRESS),
        sinceTimestamp: new UnixTime(1695199499),
        tokens: ['DAI', 'sDAI'],
        description: 'Escrow for DAI',
        upgradableBy: ['EscrowAdmin'],
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://polygon-rpc.com/zkevm',
      defaultCallsPerMinute: 500,
      startBlock: 1,
    },
    liveness: {
      duplicateData: [
        {
          from: 'stateUpdates',
          to: 'proofSubmissions',
        },
      ],
      proofSubmissions: [],
      batchSubmissions: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
          ),
          selector: '0x5e9145c9',
          functionSignature:
            'function sequenceBatches((bytes,bytes32,uint64,uint64)[] batches,address l2Coinbase)',
          sinceTimestamp: new UnixTime(1679653163),
          untilTimestamp: new UnixTime(1707822059),
        },
      ],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
          ),
          selector: '0x2b0006fa',
          functionSignature:
            'function verifyBatchesTrustedAggregator(uint64 pendingStateNum,uint64 initNumBatch,uint64 finalNewBatch,bytes32 newLocalExitRoot,bytes32 newStateRoot,bytes32[24] proof)',
          sinceTimestamp: new UnixTime(1679653163),
          untilTimestamp: new UnixTime(1707822059),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
          ),
          selector: '0x621dd411',
          functionSignature:
            'function verifyBatches(uint64 pendingStateNum,uint64 initNumBatch,uint64 finalNewBatch,bytes32 newLocalExitRoot,bytes32 newStateRoot,bytes32[24] calldata proof) ',
          sinceTimestamp: new UnixTime(1679653163),
          untilTimestamp: new UnixTime(1707822059),
        },
      ],
    },
  },
  chainConfig: {
    name: 'polygonzkevm',
    chainId: 1101,
    explorerUrl: 'https://zkevm.polygonscan.com',
    explorerApi: {
      url: 'https://api-zkevm.polygonscan.com/api',
      type: 'etherscan',
    },
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 57746,
        version: '3',
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'PolygonRollupManager',
          references: [
            'https://etherscan.io/address/0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      description:
        RISK_VIEW.DATA_ON_CHAIN.description +
        ' Unlike most ZK rollups transactions are posted instead of state diffs.',
      sources: [
        {
          contract: 'PolygonZkEVMExistentEtrog',
          references: [
            'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
          ],
        },
      ],
    },
    exitWindow: exitWindowRisk,
    // this will change once the isForcedBatchDisallowed is set to false inside Polygon ZkEvm contract (if they either lower timeouts or increase the timelock delay)
    sequencerFailure: {
      ...SEQUENCER_NO_MECHANISM(isForcedBatchDisallowed),
      sources: [
        {
          contract: 'PolygonZkEVMExistentEtrog',
          references: [
            'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
      description:
        RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK.description +
        ` There is a ${trustedAggregatorTimeoutString} delay for proving and a ${pendingStateTimeoutString} delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.`,
      sources: [
        {
          contract: 'PolygonRollupManager',
          references: [
            'https://etherscan.io/address/0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
            'https://etherscan.io/address/0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: [
          false,
          'Security Council members are not publicly known.',
        ],
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/0xPolygonHermez/zkevm-node',
    },
  ),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'PolygonRollupManager.sol - Etherscan source code, _verifyAndRewardBatches function',
          href: 'https://etherscan.io/address/0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'PolygonZkEVMExistentEtrog.sol - Etherscan source code, sequenceBatches function',
          href: 'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
        },
      ],
    },
    operator: {
      name: 'The system has a centralized sequencer',
      description:
        'Only a trusted sequencer is allowed to submit transaction batches. A mechanism for users to submit their own batches is currently disabled.',
      risks: [
        FRONTRUNNING_RISK,
        {
          category: 'Funds can be frozen if',
          text: 'the sequencer refuses to include an exit transaction.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'PolygonZkEVMExistentEtrog.sol - Etherscan source code, onlyTrustedSequencer modifier',
          href: 'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      description:
        'The mechanism for allowing users to submit their own transactions is currently disabled.',
      references: [
        {
          text: 'PolygonZkEVMExistentEtrog.sol - Etherscan source code, forceBatchAddress address',
          href: 'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
        references: [
          {
            text: 'PolygonZkEvmBridge.sol - Etherscan source code, claimAsset function',
            href: 'https://etherscan.io/address/0xb1585916487AcEdD99952086f2950763D253b923',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/0xPolygonHermez/zkevm-node).',
    compressionScheme: 'No compression scheme yet.',
    genesisState:
      'The genesis state, whose corresponding root is accessible as Batch 0 root in the `batchNumToStateRoot` method of PolygonZkEvm, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/main/deployment/genesis.json).',
    dataFormat:
      'The trusted sequencer batches transactions according to the specifications documented [here](https://wiki.polygon.technology/docs/zkevm/protocol/transaction-batching/#transactions).',
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      'Admin of the PolygonZkEvm rollup, can set core system parameters like timeouts, sequencer and aggregator as well as deactivate emergency state. They can also upgrade the PolygonZkEvm contracts, but are restricted by a 10d delay unless rollup is put in the Emergency State.',
    ),
    {
      name: 'Sequencer',
      accounts: [
        discovery.getPermissionedAccount(
          'PolygonZkEVMExistentEtrog',
          'trustedSequencer',
        ),
      ],
      description:
        'Its sole purpose and ability is to submit transaction batches. In case they are unavailable users cannot rely on the force batch mechanism because it is currently disabled.',
    },
    {
      name: 'Proposer (Trusted Aggregator)',
      accounts: aggregators,
      description: `The trusted proposer (called Aggregator) provides ZK proofs for all the supported systems. In case they are unavailable a mechanism for users to submit proofs on their own exists, but is behind a ${trustedAggregatorTimeoutString} delay for proving and a ${pendingStateTimeoutString} delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.`,
    },
    ...discovery.getMultisigPermission(
      'SecurityCouncil',
      'The Security Council is a multisig that can be used to trigger the emergency state which pauses bridge functionality, restricts advancing system state and removes the upgradeability delay.',
    ),
    ...discovery.getMultisigPermission(
      'EscrowsAdmin',
      'Escrows Admin can instantly upgrade wstETH, DAI and USDC bridges.',
    ),
    {
      name: 'Forced Batcher',
      accounts: [
        discovery.getPermissionedAccount(
          'PolygonZkEVMExistentEtrog',
          'forceBatchAddress',
        ),
      ],
      description:
        'Sole account allowed to submit forced transactions. If this address is the zero address, anyone can submit forced transactions.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('PolygonZkEVMExistentEtrog', {
        description:
          'The main contract of the Polygon zkEVM rollup. Contains sequencing and forced transaction logic.',
        ...timelockUpgrades,
      }),
      discovery.getContractDetails('PolygonRollupManager', {
        description: `It defines the rules of the system including core system parameters, permissioned actors as well as emergency procedures. The emergency state can be activated either by the Security Council, by proving a soundness error or by presenting a sequenced batch that has not been aggregated before a ${_HALT_AGGREGATION_TIMEOUT} timeout. This contract receives L2 state roots as well as ZK proofs.`,
        ...timelockUpgrades,
      }),
      discovery.getContractDetails('Bridge', {
        description:
          'The escrow contract for user funds. It is mirrored on the L2 side and can be used to transfer both ERC20 assets and arbitrary messages. To transfer funds a user initiated transaction on both sides is required.',
        ...timelockUpgrades,
      }),
      discovery.getContractDetails('GlobalExitRootV2', {
        description:
          'Synchronizes deposit and withdraw merkle trees across L1 and the L2s. The global root from this contract is injected into the L2 contracts.',
        ...timelockUpgrades,
      }),
      discovery.getContractDetails(
        'FflonkVerifier',
        'An autogenerated contract that verifies ZK proofs in the PolygonRollupManager system.',
      ),
    ],
    references: [
      {
        text: 'State injections - stateRoot and exitRoot are part of the validity proof input.',
        href: 'https://etherscan.io/address/0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(upgradeDelayString)],
  },
  milestones: [
    {
      name: 'Polygon zkEVM Etrog upgrade',
      link: 'https://docs.polygon.technology/zkEVM/architecture/protocol/etrog-upgrade/#etrog-upgrade',
      date: '2024-02-13',
      description: 'Polygon zkEVM is upgraded to the Polygon Etrog version.',
    },
    {
      name: 'Polygon zkEVM Mainnet Beta is Live',
      link: 'https://polygon.technology/blog/polygon-zkevm-mainnet-beta-is-live?utm_source=twitter&utm_medium=social&utm_campaign=zkevm-launch&utm_term=mainnet-beta-live&utm_content=blog',
      date: '2023-03-27T00:00:00Z',
      description: 'Polygon zkEVM public beta launched.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'State diffs vs raw tx data',
      url: 'https://twitter.com/krzKaczor/status/1641505354600046594',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
}
