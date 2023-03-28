import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { CONTRACTS, makeBridgeCompatible, RISK_VIEW } from './common'
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('polygonzkevm')

const TODO_DELAY = '10 days'

export const polygonzkevm: Layer2 = {
  type: 'layer2',
  id: ProjectId('polygonzkevm'),
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    warning:
      'This project is currently undergoing review from our research team.',
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
  },
  config: {
    escrows: [
      {
        address: discovery.getContract('Bridge').address,
        sinceTimestamp: new UnixTime(1679653127),
        tokens: '*',
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    //include info that txs are posted, not state diffs
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    // get this value from discovery
    upgradeability: RISK_VIEW.UPGRADE_DELAY(TODO_DELAY),
    // this will change once the isForcedBatchDisallowed is set to false inside Polygon ZkEvm contract
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM,
    validatorFailure: {
      value: 'verifyBatches(...) after delay ',
      description: `if (
        sequencedBatches[finalNewBatch].sequencedTimestamp +
            trustedAggregatorTimeout >
        block.timestamp
    )`,
      //sentiment?: 'warning' | 'bad'
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    // provided there are no bugs in the ZK circuits
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: {
      name: '',
      description: '',
      references: [],
      risks: [],
    },
    dataAvailability: {
      // include info that txs are in DA not state diffs
      name: '',
      description: '',
      references: [],
      risks: [],
    },
    operator: {
      name: '',
      description: '',
      references: [],
      risks: [],
    },
    forceTransactions: {
      name: '',
      description: '',
      references: [],
      risks: [],
    },
    exitMechanisms: [],
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
      )} multisig. They can also upgrade the PolygonZkEvm contracts, but are restricted by a ${TODO_DELAY} delay.`,
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
        name: 'PolygonZkEvm',
        address: discovery.getContract('PolygonZkEvm').address,
        description:
          'The main contract of the Polygon zkEVM rollup. It defines the rules of the system including core system parameters, permissioned actors as well as emergency procedures. This contract receives transaction batches, L2 state roots as well as zk proofs.',
      },
      {
        name: 'Bridge',
        address: discovery.getContract('Bridge').address,
        description:
          'The escrow contract for user funds. It is mirrored on the L2 side and can be used to transfer both ERC20 assets and arbitrary messages. To transfer funds a user initiated transaction on both sides is required.',
      },
      {
        name: 'GlobalExitRoot',
        address: discovery.getContract('GlobalExitRoot').address,
        description:
          'Synchronizes deposit and withdraw merkle trees across L1 and L2. The global root from this contract is injected into the L2 contract.',
      },
      // {
      //   name: 'ProxyAdmin',
      //   address: discovery.getContract('ProxyAdmin').address,
      //   description: 'TODO: new upgradeability section',
      // },
      // {
      //   name: 'Timelock',
      //   address: discovery.getContract('Timelock').address,
      //   description: 'TODO: new upgradeability section',
      // },
      {
        name: 'FflonkVerifier',
        address: discovery.getContract('FflonkVerifier').address,
        description:
          'An autogenerated contract that verifies zk proofs in the PolygonZkEvm system.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(TODO_DELAY)],
  },
}
