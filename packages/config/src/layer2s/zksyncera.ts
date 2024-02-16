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
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zksync2')

const executionDelay = discovery.getContractValue<number>(
  'ValidatorTimelock',
  'executionDelay',
)
const delay = executionDelay > 0 && formatSeconds(executionDelay)

const upgrades = {
  upgradableBy: ['zkSync Era Multisig'],
  upgradeDelay: 'No delay',
}

const upgradeDelay = 0

export const zksyncera: Layer2 = {
  type: 'layer2',
  id: ProjectId('zksync2'),
  display: {
    name: 'zkSync Era',
    slug: 'zksync-era',
    warning: delay
      ? `Withdrawals are delayed by ${delay}. The length of the delay can be arbitrarily set by a MultiSig.`
      : undefined,
    description:
      'zkSync Era is a general-purpose ZK Rollup by Matter Labs with full EVM compatibility.',
    purposes: ['Universal'],
    provider: 'ZK Stack',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'StateDiffs',

    links: {
      websites: ['https://zksync.io/', 'https://ecosystem.zksync.io/'],
      apps: ['https://bridge.zksync.io/', 'https://portal.zksync.io/'],
      documentation: ['https://era.zksync.io/docs/'],
      explorers: [
        'https://explorer.zksync.io/',
        'https://zksync-era.l2scan.co/',
      ],
      repositories: ['https://github.com/matter-labs/zksync-era'],
      socialMedia: [
        'https://zksync.mirror.xyz/',
        'https://join.zksync.dev/',
        'https://t.me/zksync',
        'https://twitter.com/zksync',
        'https://twitter.com/zkSyncDevs',
      ],
      rollupCodes: 'https://rollup.codes/zksync-era',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      explanation: delay
        ? `zkSync Era is a ZK rollup that posts state diffs to the L1. Transactions within a state diff can be considered final when proven on L1 using a ZK proof, except that an operator can revert them if not executed yet. Currently, there is at least a ${delay} delay between state diffs verification and the execution of the corresponding state actions.`
        : undefined,
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x32400084C286CF3E17e7B677ea9583e60a000324'),
        sinceTimestamp: new UnixTime(1676268575),
        tokens: ['ETH'],
        description: 'Main rollup contract, additionally serving as an escrow.',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063'),
        sinceTimestamp: new UnixTime(1676367083),
        tokens: '*',
        description:
          'Standard bridge for depositing ERC20 tokens to zkSync Era.',
        ...upgrades,
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://mainnet.era.zksync.io',
      defaultCallsPerMinute: 1500,
      startBlock: 1,
    },
    liveness: {
      proofSubmissions: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x3dB52cE065f728011Ac6732222270b3F2360d919',
          ),
          selector: '0x7739cbe7',
          functionSignature:
            'function proveBlocks((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32) calldata,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[] calldata,(uint256[],uint256[]) calldata)',
          sinceTimestamp: new UnixTime(1679602559),
          untilTimestamp: new UnixTime(1701718427),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa0425d71cB1D6fb80E65a5361a04096E0672De03',
          ),
          selector: '0x7f61885c',
          functionSignature:
            'function proveBatches(tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32), tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32)[], tuple(uint256[], uint256[]))',
          sinceTimestamp: new UnixTime(1701258299),
        },
      ],
      batchSubmissions: [],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x3dB52cE065f728011Ac6732222270b3F2360d919',
          ),
          selector: '0xce9dcf16',
          functionSignature:
            'function executeBlocks((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[] calldata _newBlocksData)',
          sinceTimestamp: new UnixTime(1679602559),
          untilTimestamp: new UnixTime(1701719687),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa0425d71cB1D6fb80E65a5361a04096E0672De03',
          ),
          selector: '0xc3d93e7c',
          functionSignature:
            'function executeBatches(tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32)[] _newBatchesData)',
          sinceTimestamp: new UnixTime(1701258299),
        },
      ],
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'ZK proofs',
      description:
        'Uses PLONK zero-knowledge proof system with KZG commitments.',
      sentiment: 'good',
      sources: [
        {
          contract: 'ValidatorTimelock',
          references: [
            'https://etherscan.io/address/0xa0425d71cB1D6fb80E65a5361a04096E0672De03#code#F1#L89',
          ],
        },
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a#code#F1#L363',
            'https://etherscan.io/address/0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B#code#F5#L26',
          ],
        },
        {
          contract: 'Verifier',
          references: [
            'https://etherscan.io/address/0x3390051435eCB25a9610A1cF17d1BA0a228A0560#code#F1#L345',
          ],
        },
      ],
      otherReferences: [
        'https://era.zksync.io/docs/dev/developer-guides/transactions/transactions.html#transaction-types',
        'https://era.zksync.io/docs/dev/developer-guides/system-contracts.html#executorfacet',
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
      sources: [
        {
          contract: 'ValidatorTimelock',
          references: [
            'https://etherscan.io/address/0xa0425d71cB1D6fb80E65a5361a04096E0672De03#code#F1#L71',
            'https://etherscan.io/tx/0xef9ad50d9b6a30365e4cc6709a5b7479fb67b8948138149597c49ef614782e1b', // example tx (see calldata)
          ],
        },
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B#code#F1#L125',
          ],
        },
      ],
      otherReferences: [
        'https://era.zksync.io/docs/dev/developer-guides/system-contracts.html#executorfacet',
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(upgradeDelay, executionDelay),
      sources: [
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0xE6426c725cB507168369c10284390E59d91eC821#code#F1#L107',
            'https://etherscan.io/address/0x0b622A2061EaccAE1c664eBC3E868b8438e03F61#code#F1#L37',
            'https://etherscan.io/address/0x0b622A2061EaccAE1c664eBC3E868b8438e03F61#code#F1#L169',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA_L1,
      sources: [
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B#code#F10#L57',
            'https://etherscan.io/address/0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B#code#F10#L74',
          ],
        },
      ],
      otherReferences: [
        'https://era.zksync.io/docs/dev/developer-guides/bridging/l1-l2-interop.html#priority-queue',
        'https://era.zksync.io/docs/dev/developer-guides/bridging/l1-l2-interop.html#priority-mode',
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a#code#F1#L187',
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
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/matter-labs/zksync-era',
    },
  ),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'Validity proofs - zkSync FAQ',
          href: 'https://era.zksync.io/docs/dev/fundamentals/rollups.html#optimistic-rollups-versus-zk-rollups',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: "What are rollups? - Developer's documentation",
          href: 'https://era.zksync.io/docs/dev/fundamentals/rollups.html#what-are-zk-rollups',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [],
    },
    forceTransactions: {
      name: 'Users can force any transaction via L1',
      description:
        'If a user is censored by L2 Sequencer, they can try to force transaction via L1 queue. Right now there is no mechanism that forces L2 Sequencer to include\
        transactions from L1 queue in an L1 block.',
      risks: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM.risks,
      references: [
        {
          text: "L1 - L2 interoperability - Developer's documentation",
          href: 'https://era.zksync.io/docs/dev/developer-guides/bridging/l1-l2-interop.html#priority-queue',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://era.zksync.io/docs/dev/developer-guides/bridging/bridging-asset.html',
          },
        ],
      },
      EXITS.FORCED('forced-withdrawals'),
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('zkSync', {
        description:
          'The main Rollup contract. Operator commits blocks, provides ZK proof which is validated by the Verifier contract \
          and process transactions (executes blocks). During block execution it processes L1 --> L2 and L2 --> L1 transactions.\
          It uses separate Verifier to validate ZK proofs. Governance manages list of Validators and can set basic rollup parameters.\
          It is also serves the purpose of ETH bridge.',
        ...upgrades,
      }),
      discovery.getContractDetails('Verifier', {
        description: 'Implements ZK proof verification logic.',
        ...upgrades,
        upgradeConsiderations:
          'Multisig can change the verifier with no delay.',
      }),
      discovery.getContractDetails(
        'ValidatorTimelock',
        'Contract delaying block execution (ie withdrawals and other L2 --> L1 messages).',
      ),
      discovery.getContractDetails('Governance', {
        description: `Owner can schedule a transparent (you see the upgrade data on-chain) or a shadow (you don't see the upgrade data on-chain) upgrade. While scheduling an upgrade the owner chooses a delay, that delay has to be bigger than ${discovery.getContractValue<number>(
          'Governance',
          'minDelay',
        )} seconds. Canceling the upgrade can be done only by the owner. The owner or the security council can perform the upgrade if the chosen delay is up. Only the security council can force the upgrade to execute even if the delay is not up.`,
        ...upgrades,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  stateDerivation: {
    nodeSoftware: `The node software is open-source, and its source code can be found [here](https://github.com/matter-labs/zksync-era).
    The main node software does not rely on Layer 1 (L1) to reconstruct the state, but you can use [this tool](https://github.com/eqlabs/zksync-state-reconstruct) for that purpose. Currently, there is no straightforward method to inject the state into the main node, but zkSync is actively working on a solution for this.`,
    compressionScheme:
      'Bytecodes undergo compression before deployment on Layer 1 (L1). You can find additional information on this process [here](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/advanced/compression.md).',
    genesisState: 'There have been neither genesis states nor regenesis.',
    dataFormat:
      'Details on data format can be found [here](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/advanced/pubdata.md).',
  },
  stateValidation:
    'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract. \n ### PROVER ARCHITECTURE\n zkSync Era proof system Boojum can be found [here](https://github.com/matter-labs/era-boojum/tree/main) and contains essential tools like the Prover, the Verifier, and other backend components.' +
    '\n\n The specs of the system can be found [here](https://github.com/matter-labs/zksync-era/tree/main/docs/specs/prover).\n ' +
    '### ZK CIRCUITS \n zkSync Era circuits are built from Boojum and are designed to replicate the behavior of the EVM. The source code can be found [here](https://github.com/matter-labs/era-zkevm_circuits/tree/main). The circuits are checked against tests that can be found [here](https://github.com/matter-labs/era-zkevm_test_harness/tree/main).\n ' +
    '### VERIFICATION KEYS GENERATION\n SNARK verification keys can be generated and checked against the Ethereum verifier contract using [this tool](https://github.com/matter-labs/zksync-era/tree/main/prover/vk_setup_data_generator_server_fri). The system requires a trusted setup.',
  permissions: [
    ...discovery.getMultisigPermission(
      'zkSync Era Multisig',
      'This MultiSig is the current Governor of zkSync Era main contract and owner of the L1EthBridge. It can upgrade zkSync Era, upgrade bridge, change rollup parameters with no delay.',
    ),
    {
      name: 'Active validator',
      accounts: [
        discovery.getPermissionedAccount('ValidatorTimelock', 'validator'),
      ],
      description:
        'This actor is allowed to propose, revert and execute L2 blocks on L1.',
    },
  ],
  milestones: [
    {
      name: 'Introduction of Boojum prover',
      link: 'https://zksync.mirror.xyz/HJ2Pj45EJkRdt5Pau-ZXwkV2ctPx8qFL19STM5jdYhc',
      date: '2023-07-17T00:00:00Z',
      description: 'Deployment of Boojum - new high-performance proof system.',
    },
    {
      name: 'zkSync 2.0 baby alpha launch',
      link: 'https://blog.matter-labs.io/baby-alpha-has-arrived-5b10798bc623',
      date: '2022-10-28T00:00:00Z',
      description: 'zkSync 2.0 baby alpha is launched on mainnet.',
    },
    {
      name: 'Fair Onboarding Alpha and Rebranding',
      link: 'https://blog.matter-labs.io/all-aboard-zksync-era-mainnet-8b8964ba7c59',
      date: '2023-02-16T00:00:00Z',
      description:
        'zkSync 2.0 rebrands to zkSync Era and lets registered projects and developers deploy on mainnet.',
    },
    {
      name: 'Full Launch Alpha',
      link: 'https://blog.matter-labs.io/gm-zkevm-171b12a26b36',
      date: '2023-03-24T00:00:00Z',
      description: 'zkSync Era is now permissionless and open for everyone.',
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
