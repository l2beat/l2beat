import { assert, formatSeconds, ProjectId } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
  SEQUENCER_NO_MECHANISM,
  STATE_CORRECTNESS,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('astarzkevm')

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
  'AstarValidiumEtrog',
  'forceBatchTimeout',
)

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
    value: 'The Security Council can remove the delay on upgrades.',
    sentiment: 'bad',
  },
} as const

const timelockUpgrades = {
  upgradableBy: ['RollupManagerAdminMultisig'],
  upgradeDelay: exitWindowRisk.value,
  upgradeConsiderations: exitWindowRisk.description,
}

const membersCountDAC = discovery.getContractValue<number>(
  'AstarValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'AstarValidiumDAC',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>(
    'AstarValidiumEtrog',
    'forceBatchAddress',
  ) !== '0x0000000000000000000000000000000000000000'

export const astarzkevm: Layer2 = {
  type: 'layer2',
  id: ProjectId('astarzkevm'),
  display: {
    name: 'Astar zkEVM',
    slug: 'astarzkevm',
    description:
      "Astar zkEVM is a Validium that leverages Polygon's CDK and zero-knowledge cryptography to enable off-chain transactions while maintaining EVM equivalence.",
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'Polygon',
    headerWarning:
      'Astar zkEVM is using AggLayer, meaning it shares the TVL escrow contracts with Polygon zkEVM and other connected chains. For now, you can check its TVL [here](https://dune.com/hashed_official/astar-zkevm). We have not verified it so proceed with caution.',
    links: {
      websites: ['https://astar.network/astar2'],
      apps: [],
      documentation: ['https://docs.astar.network/docs/build/zkEVM/'],
      explorers: ['https://astar-zkevm.explorer.startale.com/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/AstarNetwork',
        'https://discord.com/invite/astarnetwork',
        'https://youtube.com/@AstarNetwork',
        'https://t.me/PlasmOfficial',
      ],
    },
  },
  config: {
    escrows: [], // the escrow is removed until shared escrows are supported
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
      ...RISK_VIEW.DATA_EXTERNAL_DAC({
        membersCount: membersCountDAC,
        requiredSignatures: requiredSignaturesDAC,
      }),
      sources: [
        {
          contract: 'AstarValidiumEtrog',
          references: [
            'https://etherscan.io/address/0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30',
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
          contract: 'AstarValidiumEtrog',
          references: [
            'https://etherscan.io/address/0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30',
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
  stage: {
    stage: 'NotApplicable',
  },
  technology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
    },
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
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted on-chain by the Sequencer, after being signed by the DAC members.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'AstarValidiumEtrog.sol - Etherscan source code, sequenceBatches function',
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
          text: 'AstarValidiumEtrog.sol - Etherscan source code, onlyTrustedSequencer modifier',
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
          text: 'AstarValidiumEtrog.sol - Etherscan source code, forceBatchAddress address',
          href: 'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
        references: [
          {
            text: 'PolygonZkEvmBridgeV2.sol - Etherscan source code, claimAsset function',
            href: 'https://etherscan.io/address/0x0feb850b183c57534b56b7d56520133c8f9bdb65',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/0xPolygon/cdk-validium-node).',
    compressionScheme: 'No compression scheme yet.',
    genesisState:
      'The genesis state, whose corresponding root is accessible as Batch 0 root in the `getRollupBatchNumToStateRoot` method of PolygonRollupManager, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/1ad7089d04910c319a257ff4f3674ffd6fc6e64e/tools/addRollupType/genesis.json).',
    dataFormat:
      'The trusted sequencer request signatures from DAC members off-chain, and posts hashed batches with signatures to the AstarValidiumEtrog contract.',
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'RollupManagerAdminMultisig',
      `Admin of the Polygon Rollup Manager contract, can set core system parameters like timeouts and aggregator as well as deactivate emergency state.`,
    ),
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      `Admin of the AstarValidiumEtrog and AstarValidiumDAC contract, can set core system parameters like the trusted sequencer and enable/disable forced batches.`,
    ),
    {
      name: 'Sequencer',
      accounts: [
        discovery.getPermissionedAccount(
          'AstarValidiumEtrog',
          'trustedSequencer',
        ),
      ],
      description:
        'Its sole purpose and ability is to submit transaction batches. In case they are unavailable users cannot rely on the force batch mechanism because it is currently disabled.',
    },
    {
      name: 'Proposer (Trusted Aggregator)',
      accounts: discovery.getAccessControlRolePermission(
        'PolygonRollupManager',
        'TRUSTED_AGGREGATOR',
      ),
      description: `The trusted proposer (called Aggregator) provides ZK proofs for all the supported systems. In case they are unavailable a mechanism for users to submit proofs on their own exists, but is behind a ${trustedAggregatorTimeoutString} delay for proving and a ${pendingStateTimeoutString} delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.`,
    },
    ...discovery.getMultisigPermission(
      'SecurityCouncil',
      'The Security Council is a multisig that can be used to trigger the emergency state which pauses bridge functionality, restricts advancing system state and removes the upgradeability delay.',
    ),
    {
      name: 'Forced Batcher',
      accounts: [
        discovery.getPermissionedAccount(
          'AstarValidiumEtrog',
          'forceBatchAddress',
        ),
      ],
      description:
        'Sole account allowed to submit forced transactions. If this address is the zero address, anyone can submit forced transactions.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('AstarValidiumEtrog', {
        description:
          'The main contract of the Astar zkEVM. Contains sequenced transaction batch hashes and forced transaction logic.',
      }),
      discovery.getContractDetails('Bridge', {
        description:
          'The escrow contract for user funds. It is mirrored on the L2 side and can be used to transfer both ERC20 assets and arbitrary messages. To transfer funds a user initiated transaction on both sides is required. Please note that this is shared escrow with other Polygon AggLayer chains, and its TVL does not correspond to Astar TVL.',
      }),
      discovery.getContractDetails('PolygonRollupManager', {
        description: `It defines the rules of the system including core system parameters, permissioned actors as well as emergency procedures. The emergency state can be activated either by the Security Council, by proving a soundness error or by presenting a sequenced batch that has not been aggregated before a ${_HALT_AGGREGATION_TIMEOUT} timeout. This contract receives L2 state roots as well as ZK proofs.`,
        ...timelockUpgrades,
      }),
      discovery.getContractDetails('GlobalExitRootV2', {
        description:
          'Synchronizes deposit and withdraw merkle trees across L1 and the L2s. The global root from this contract is injected into the L2 contracts.',
        ...timelockUpgrades,
      }),
      discovery.getContractDetails('AstarValidiumDAC', {
        description:
          'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
      }),
      discovery.getContractDetails(
        'AstarVerifier',
        'An autogenerated contract that verifies ZK proofs in the PolygonRollupManager system.',
      ),
      discovery.getContractDetails(
        'Timelock',
        (() => {
          const timelockAdmin = discovery.getAccessControlField(
            'Timelock',
            'TIMELOCK_ADMIN_ROLE',
          ).members[1]
          const timelockProposer = discovery.getAccessControlField(
            'Timelock',
            'PROPOSER_ROLE',
          ).members[0]
          const timelockExecutor = discovery.getAccessControlField(
            'Timelock',
            'EXECUTOR_ROLE',
          ).members[0]
          const timelockCanceller = discovery.getAccessControlField(
            'Timelock',
            'CANCELLER_ROLE',
          ).members[0]
          assert(
            timelockAdmin === timelockProposer &&
              timelockProposer === timelockExecutor &&
              timelockExecutor === timelockCanceller,
            'Timelock roles have changed, update Timelock description.',
          )
          return `Contract upgrades have to go through a ${upgradeDelayString} timelock unless the Emergency State is activated. It can also add rollup types that can be used to upgrade verifier contracts of existing systems. It is controlled by the AdminMultisig.`
        })(),
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
      name: 'Astar zkEVM Launch',
      link: 'https://polygon.technology/blog/astar-zkevm-built-with-polygon-cdk-connects-to-agglayer-and-taps-unified-liquidity-with-polygon-zkevm',
      date: '2024-03-06',
      description:
        'Astar Network launched Astar zkEVM, integrated with Polygon AggLayer.',
    },
  ],
}
