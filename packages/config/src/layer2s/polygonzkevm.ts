import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  makeBridgeCompatible,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('polygonzkevm')

// TODO: get this value from discovery
const TODO_DELAY = '10 days'

export const polygonzkevm: Layer2 = {
  type: 'layer2',
  id: ProjectId('polygonzkevm'),
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    warning: 'The forced transaction mechanism is currently disabled.',
    description:
      'Polygon zkEVM is aiming to become a decentralized Ethereum Layer 2 scalability solution that uses cryptographic zero-knowledge proofs to offer validity and finality of off-chain transactions. Polygon zkEVM wants to be equivalent with the Ethereum Virtual Machine.',
    purpose: 'Universal',
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      apps: ['https://bridge.zkevm-rpc.com'],
      documentation: [
        'https://wiki.polygon.technology/docs/zkEVM/introduction',
      ],
      explorers: ['https://zkevm.polygonscan.com/'],
      repositories: ['https://github.com/0xPolygonHermez'],
      socialMedia: [
        'https://twitter.com/0xPolygon',
        'https://discord.gg/XvpHAxZ',
        'https://polygon.technology/blog-tags/polygon-zk',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      {
        address: discovery.getContract('Bridge').address,
        sinceTimestamp: new UnixTime(1679653127),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://polygon-rpc.com/zkevm',
      callsPerMinute: 500,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    //include info that txs are posted, not state diffs
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      description:
        RISK_VIEW.DATA_ON_CHAIN.description +
        ' Unlike most zk rollups transactions are posted instead of state diffs.',
    },
    upgradeability: RISK_VIEW.UPGRADABLE_POLYGON_ZKEVM,
    // TODO: get delay time (10 days) from config
    // this will change once the isForcedBatchDisallowed is set to false inside Polygon ZkEvm contract
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM,
    validatorFailure: {
      value: 'Submit proofs',
      description:
        'If the validator fails, users can leverage open source prover to submit proofs to the smart contract. There is a delay for proving and for finalizing state proven in this way.',
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.VALIDITY_PROOFS,
    dataAvailability: DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
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
      references: [],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.NO_MECHANISM,
      description:
        'The mechanism for allowing users to submit their own transactions is currently disabled.',
    },
    exitMechanisms: [EXITS.REGULAR('zk', 'merkle proof')],
    category: 'ZK Rollup',
  },
  permissions: [
    {
      name: 'Admin Multisig',
      accounts: [
        {
          address: discovery.getContract('AdminMultisig').address,
          type: 'MultiSig',
        },
      ],
      description: `Admin of the PolygonZkEvm rollup, can set core system parameters like timeouts, sequencer and aggregator as well as deactivate emergency state. It is a ${discovery.getMultisigStats(
        'AdminMultisig',
      )} multisig. They can also upgrade the PolygonZkEvm contracts, but are restricted by a ${TODO_DELAY} delay unless rollup is put in the Emergency State.`,
    },
    {
      name: 'Sequencer',
      accounts: [
        {
          address: EthereumAddress(
            discovery.getContractValue<string>(
              'PolygonZkEvm',
              'trustedSequencer',
            ),
          ),
          type: 'EOA',
        },
      ],
      description:
        'Its sole purpose and ability is to submit transaction batches. In case they are unavailable users cannot rely on the force batch mechanism because it is currently disabled.',
    },
    {
      name: 'Aggregator',
      accounts: [
        {
          address: EthereumAddress(
            discovery.getContractValue<string>(
              'PolygonZkEvm',
              'trustedAggregator',
            ),
          ),
          type: 'EOA',
        },
      ],
      description:
        'The trusted aggregator provides the PolygonZkEvm contract with zk proofs of the new system state. In case they are unavailable a mechanism for users to submit proofs on their own exists, but is behind a significant delay.',
    },
    {
      name: 'Security Council',
      accounts: [
        {
          address: discovery.getContract('OwnerMultisig').address,
          type: 'MultiSig',
        },
      ],
      description: `The security council is a multisig that can be used to trigger the emergency state which pauses bridge functionality and restricts advancing system state. It is a ${discovery.getMultisigStats(
        'OwnerMultisig',
      )} multisig.`,
    },
  ],
  contracts: {
    addresses: [
      {
        ...discovery.getMainContractDetails('PolygonZkEvm'),
        description:
          'The main contract of the Polygon zkEVM rollup. It defines the rules of the system including core system parameters, permissioned actors as well as emergency procedures. This contract receives transaction batches, L2 state roots as well as zk proofs.',
      },
      {
        ...discovery.getMainContractDetails('Bridge'),
        description:
          'The escrow contract for user funds. It is mirrored on the L2 side and can be used to transfer both ERC20 assets and arbitrary messages. To transfer funds a user initiated transaction on both sides is required.',
      },
      {
        ...discovery.getMainContractDetails('GlobalExitRoot'),
        description:
          'Synchronizes deposit and withdraw merkle trees across L1 and L2. The global root from this contract is injected into the L2 contract.',
      },
      {
        ...discovery.getMainContractDetails('FflonkVerifier'),
        description:
          'An autogenerated contract that verifies zk proofs in the PolygonZkEvm system.',
      },
    ],
    references: [
      {
        // TODO: do we need to trust the Sequencer to perform injections?
        text: 'State injections - PolygonZkEvm L2 source code',
        href: 'https://github.com/0xPolygonHermez/zkevm-contracts/blob/b1cefea1431e59b2121e543b786b93af99e859f4/contracts/PolygonZkEVMGlobalExitRootL2.sol#L17',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(TODO_DELAY)],
  },
  // TODO: new upgradeability section with ProxyAdmin and Timelock
  milestones: [
    {
      name: 'Polygon zkEVM Mainnet Beta is Live',
      link: 'https://polygon.technology/blog/polygon-zkevm-mainnet-beta-is-live?utm_source=twitter&utm_medium=social&utm_campaign=zkevm-launch&utm_term=mainnet-beta-live&utm_content=blog',
      date: '2023-03-27T00:00:00Z',
      description: 'Polygon zkEVM public beta launched.',
    },
  ],
}
