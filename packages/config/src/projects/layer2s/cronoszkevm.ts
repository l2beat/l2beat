import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
  makeBridgeCompatible,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('cronoszkevm')

const executionDelaySeconds = discovery.getContractValue<number>(
  'ValidatorTimelock',
  'executionDelay',
)

const executionDelay =
  executionDelaySeconds > 0 && formatSeconds(executionDelaySeconds)

const upgrades = {
  upgradableBy: ['Matter Labs Multisig'],
  upgradeDelay: 'No delay',
}

const upgradeDelay = discovery.getContractValue<number>(
  'Governance',
  'minDelay',
)

const discoveredSecurityCouncilAddress = discovery.getContractValue<string>(
  'Governance',
  'securityCouncil',
)

const isSCset =
  discoveredSecurityCouncilAddress !==
  '0x0000000000000000000000000000000000000000'

/**
 * Fetches Validators from ValidatorTimelock events:
 * It is more complicated to accomodate the case in which
 * a validator is added and removed more than once.
 */
const validators = () => {
  const validatorsAdded = discovery.getContractValue<string[]>(
    'ValidatorTimelock',
    'zksyncValidatorsAdded',
  )
  const validatorsRemoved = discovery.getContractValue<string[]>(
    'ValidatorTimelock',
    'zksyncValidatorsRemoved',
  )

  // Create a map to track the net state of each validator (added or removed)
  const validatorStates = new Map<string, number>()

  // Increment for added validators
  validatorsAdded.forEach((validator) => {
    validatorStates.set(validator, (validatorStates.get(validator) || 0) + 1)
  })

  // Decrement for removed validators
  validatorsRemoved.forEach((validator) => {
    validatorStates.set(validator, (validatorStates.get(validator) || 0) - 1)
  })

  // Filter validators that have a net positive state (added more times than removed)
  return Array.from(validatorStates.entries())
    .filter(([_, state]) => state > 0)
    .map(([validator, _]) => validator)
}

export const cronoszkevm: Layer2 = {
  type: 'layer2',
  id: ProjectId('cronoszkevm'),
  badges: [
    Badge.VM.EVM,
    Badge.DA.CustomDA,
    Badge.Stack.ZKStack,
    Badge.Infra.ElasticChain,
  ],
  display: {
    tvlWarning: {
      content:
        'The TVL is currently shared among all projects using the shared ZK stack contracts. See ZKsync Era TVL.',
      sentiment: 'warning',
    },
    name: 'Cronos zkEVM',
    slug: 'cronoszkevm',
    description:
      'Cronos zkEVM is a general-purpose Validium on Ethereum built on the ZK Stack, scaling the existing portfolio of Cronos apps and chains.',
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://cronos.org/zkevm'],
      apps: ['https://zkevm.cronos.org/bridge'],
      documentation: ['https://docs-zkevm.cronos.org/'],
      explorers: ['https://explorer.zkevm.cronos.org/'],
      repositories: [],
      socialMedia: [
        'https://x.com/cronos_chain',
        'https://discord.com/invite/cronos',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      explanation: executionDelay
        ? `Cronos zkEVM is a ZK Validium that posts state diffs to the L1. Transactions within a state diff can be considered final when proven on L1 using a ZK proof, except that an operator can revert them if not executed yet. Currently, there is at least a ${executionDelay} delay between state diffs verification and the execution of the corresponding state actions.`
        : undefined,
    },
    finality: {
      finalizationPeriod: executionDelaySeconds,
      warnings: {
        timeToInclusion: {
          sentiment: 'warning',
          value:
            'Proven but not executed batches can be reverted by the validator(s) or the StateTransitionManager.',
        },
      },
    },
  },
  config: {
    associatedTokens: ['zkCRO'],
    escrows: [], // shared escrow with zk stack
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://mainnet.zkevm.cronos.org',
      defaultCallsPerMinute: 1500,
      startBlock: 1,
    },
    trackedTxs: [
      // {
      //   uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      //   query: {
      //     formula: 'functionCall',
      //     address: EthereumAddress(
      //       '0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E',
      //     ),
      //     selector: '0x6edd4f12',
      //     functionSignature:
      //       'function commitBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment), (uint64 batchNumber, uint64 timestamp, uint64 indexRepeatedStorageChanges, bytes32 newStateRoot, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 bootloaderHeapInitialContentsHash, bytes32 eventsQueueStateHash, bytes systemLogs, bytes pubdataCommitments)[] _newBatchesData)',
      //     sinceTimestamp: new UnixTime(1717681823),
      //   },
      // },
      // {
      //   uses: [
      //     { type: 'liveness', subtype: 'proofSubmissions' },
      //     { type: 'l2costs', subtype: 'proofSubmissions' },
      //   ],
      //   query: {
      //     formula: 'functionCall',
      //     address: EthereumAddress(
      //       '0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E',
      //     ),
      //     selector: '0xc37533bb',
      //     functionSignature:
      //       'function proveBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment), (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[], (uint256[] recursiveAggregationInput, uint256[] serializedProof))',
      //     sinceTimestamp: new UnixTime(1717694375),
      //   },
      // },
      // {
      //   uses: [
      //     { type: 'liveness', subtype: 'stateUpdates' },
      //     { type: 'l2costs', subtype: 'stateUpdates' },
      //   ],
      //   query: {
      //     formula: 'functionCall',
      //     address: EthereumAddress(
      //       '0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E',
      //     ),
      //     selector: '0x6f497ac6',
      //     functionSignature:
      //       'function executeBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _newBatchesData)',
      //     sinceTimestamp: new UnixTime(1717683407),
      //   },
      // },
    ],
    // finality: {
    //   type: 'zkSyncEra',
    //   stateUpdate: 'zeroed',
    //   minTimestamp: new UnixTime(1708556400),
    //   lag: 0,
    // },
  },
  chainConfig: {
    name: 'zksync2',
    chainId: 324,
    explorerUrl: 'https://explorer.zksync.io/',
    explorerApi: {
      url: 'https://api-era.zksync.network/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1676384520),
    coingeckoPlatform: 'zksync',
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (blobs or calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'State diffs (compressed)',
  }),
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
            'https://etherscan.io/address/0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E#code#F1#L169',
          ],
        },
        {
          contract: 'ZKsync',
          references: [
            'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L448',
            'https://etherscan.io/address/0xE60E94fCCb18a81D501a38959E532C0A85A1be89#code#F6#L23',
          ],
        },
        {
          contract: 'Verifier',
          references: [
            'https://etherscan.io/address/0x70F3FBf8a427155185Ec90BED8a3434203de9604#code#F1#L343',
          ],
        },
      ],
      otherReferences: [
        'https://docs.zksync.io/zk-stack/concepts/transaction-lifecycle#transaction-types',
        'https://docs.zksync.io/build/developer-reference/era-contracts/l1-contracts#executorfacet',
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
      sources: [
        {
          contract: 'ValidatorTimelock',
          references: [
            'https://etherscan.io/address/0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E#code#F1#L120',
            'https://etherscan.io/tx/0x9dbf29985eae00b7a1b7dbd5b21eedfb287be17310eb8bef6c524990b6928f63', // example tx (see calldata, blob)
          ],
        },
        {
          contract: 'ZKsync',
          references: [
            'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L216',
            'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F11#L120',
          ],
        },
      ],
      otherReferences: [
        'https://docs.zksync.io/build/developer-reference/era-contracts/l1-contracts#executorfacet',
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(upgradeDelay, executionDelaySeconds),
      sources: [
        {
          contract: 'ZKsync',
          references: [
            'https://etherscan.io/address/0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a#code#F1#L114', // upgradeChainFromVersion() onlyAdminOrStateTransitionManager
            'https://etherscan.io/address/0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a#code#F1#L128', // executeUpgrade() onlyStateTransitionManager
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
      sources: [
        {
          contract: 'ZKsync',
          references: [
            'https://etherscan.io/address/0xCDB6228b616EEf8Df47D69A372C4f725C43e718C#code#F1#L53',
            'https://etherscan.io/address/0xE60E94fCCb18a81D501a38959E532C0A85A1be89#code#F1#L95',
          ],
        },
      ],
      otherReferences: [
        'https://docs.zksync.io/build/developer-reference/l1-l2-interoperability#priority-queue',
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'ZKsync',
          references: [
            'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L219',
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
        fraudProofSystemIsPermissionless: null, // why not false?
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/matter-labs/zksync-era',
    },
  ),
  technology: {
    newCryptography: NEW_CRYPTOGRAPHY.ZK_BOTH,
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
    operator: OPERATOR.CENTRALIZED_OPERATOR,
    forceTransactions: {
      name: 'Users can force any transaction via L1',
      description:
        'If a user is censored by L2 Sequencer, they can try to force transaction via L1 queue. Right now there is no mechanism that forces L2 Sequencer to include\
        transactions from L1 queue in an L2 block.',
      risks: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM.risks,
      references: [
        {
          text: "L1 - L2 interoperability - Developer's documentation",
          href: 'https://docs.zksync.io/build/developer-reference/l1-l2-interoperability#priority-queue',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
        references: [
          {
            text: 'Withdrawing funds - ZKsync documentation',
            href: 'https://docs.zksync.io/build/developer-reference/bridging-assets',
          },
        ],
      },
      EXITS.FORCED('forced-withdrawals'),
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('ZKsync', {
        description:
          'The main Rollup contract. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract \
          then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.',
        ...upgrades,
      }),
      discovery.getContractDetails('Governance', {
        description: `Intermediary governance contract with two roles and a customizable delay. 
        This delay is only mandatory for transactions scheduled by the *Owner* role and can be set by the *SecurityCouncil* role. 
        The *SecurityCouncil* role can execute arbitrary upgrade transactions immediately. 
        Currently the delay is set to ${formatSeconds(
          discovery.getContractValue<number>('Governance', 'minDelay'),
        )}
        ${isSCset ? '.' : ' and the *SecurityCouncil* role is not used.'}`,
        ...upgrades,
      }),
      discovery.getContractDetails('ChainAdmin', {
        description:
          'Intermediary governance contract that has the *Admin* (not upgradeability admin) role for the shared contracts and for ZKsync Era.',
      }),
      discovery.getContractDetails(
        'ValidatorTimelock',
        'Intermediary contract between the *Validators* and the `ZKsync Era diamond` that delays block execution (ie withdrawals and other L2 --> L1 messages).',
      ),
      discovery.getContractDetails('Verifier', {
        description: 'Implements ZK proof verification logic.',
        ...upgrades,
        upgradeConsiderations:
          'Multisig can change the verifier with no delay.',
      }),
      discovery.getContractDetails('L1SharedBridge', {
        description:
          'This bridge contract escrows all ERC-20s and ETH that are deposited to ZKsync Era - and in the future - other registered ZK stack chains.',
        ...upgrades,
      }),
      discovery.getContractDetails('BridgeHub', {
        description:
          'Sits between the single shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.',
        ...upgrades,
      }),
      discovery.getContractDetails('StateTransitionManager', {
        description:
          'Defines L2 diamond contract creation and upgrade, proof verification for the `ZKsync diamond` contract connected to it (and potential other L2 diamond contracts that opt in to share this logic).',
        ...upgrades,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  stateDerivation: {
    nodeSoftware: `The node software is open-source, and its source code can be found [here](https://github.com/matter-labs/zksync-era).
    The main node software does not rely on Layer 1 (L1) to reconstruct the state, but you can use [this tool](https://github.com/eqlabs/zksync-state-reconstruct) for that purpose. Currently, there is no straightforward method to inject the state into the main node, but ZKsync is actively working on a solution for this.`,
    compressionScheme:
      'Bytecodes undergo compression before deployment on Layer 1 (L1). You can find additional information on this process [here](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/advanced/compression.md).',
    genesisState: 'There have been neither genesis states nor regenesis.',
    dataFormat:
      'Details on data format can be found [here](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/advanced/pubdata.md).',
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Prover Architecture',
        description:
          'ZKsync Era proof system Boojum can be found [here](https://github.com/matter-labs/era-boojum/tree/main) and contains essential tools like the Prover, the Verifier, and other backend components. The specs of the system can be found [here](https://github.com/matter-labs/zksync-era/tree/main/docs/specs/prover).',
      },
      {
        title: 'ZK Circuits',
        description:
          'ZKsync Era circuits are built from Boojum and are designed to replicate the behavior of the EVM. The source code can be found [here](https://github.com/matter-labs/era-zkevm_circuits/tree/main). The circuits are checked against tests that can be found [here](https://github.com/matter-labs/era-zkevm_test_harness/tree/main).',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the proof system is implemented incorrectly.',
          },
        ],
      },
      {
        title: 'Verification Keys Generation',
        description:
          'SNARK verification keys can be generated and checked against the Ethereum verifier contract using [this tool](https://github.com/matter-labs/zksync-era/tree/main/prover/vk_setup_data_generator_server_fri). The system requires a trusted setup.',
      },
    ],
    proofVerification: {
      aggregation: true,
      requiredTools: [
        {
          name: 'Custom tool',
          version: 'v14.2.0',
          link: 'https://github.com/matter-labs/zksync-era/tree/prover-v14.2.0/prover/vk_setup_data_generator_server_fri',
        },
      ],
      verifiers: [
        {
          name: 'ZKsyncEraVerifier',
          description:
            'ZKsync Era utilizes [Boojum](https://github.com/matter-labs/era-boojum/tree/main) as the main proving stack for their system. Boojum is an implementation of the [Redshift](https://eprint.iacr.org/2019/1400.pdf) protocol. The protocol makes use of recursive proof aggregation. The final Redshift proof is wrapped in a SNARK (Plonk + KZG) proof.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x70F3FBf8a427155185Ec90BED8a3434203de9604',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Final wrap',
              proofSystem: 'Plonk SNARK',
              mainArithmetization: 'Plonk',
              mainPCS: 'KZG',
              trustedSetup: 'Aztec ceremony',
              link: 'https://github.com/matter-labs/era-zkevm_test_harness/blob/v1.5.0/circuit_definitions/src/circuit_definitions/aux_layer/wrapper.rs',
            },
            {
              name: 'Aggregation circuit',
              proofSystem: 'Redshift',
              mainArithmetization: 'Plonk',
              mainPCS: 'LPC',
              trustedSetup: 'None',
              link: 'https://github.com/matter-labs/era-zkevm_test_harness/blob/v1.5.0/circuit_definitions/src/circuit_definitions/recursion_layer/mod.rs#L45',
            },
            {
              name: 'Main circuit',
              proofSystem: 'Redshift',
              mainArithmetization: 'Plonk',
              mainPCS: 'LPC',
              trustedSetup: 'None',
              link: 'https://github.com/matter-labs/era-zkevm_circuits',
            },
          ],
        },
      ],
    },
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Matter Labs Multisig',
      'This MultiSig is the current central Admin for upgradeability and configuration of the rollup system and can potentially steal all funds.',
    ),
    {
      name: 'ChainAdmin Owner',
      accounts: [discovery.getPermissionedAccount('ChainAdmin', 'owner')],
      description:
        'Can manage fees, apply predefined upgrades, censor bridge transactions and revert batches (*Admin* role).',
    },
    {
      name: 'Validators',
      accounts: validators().map((v) => discovery.formatPermissionedAccount(v)),
      description:
        'Actors that are allowed to propose, execute and revert L2 batches on L1 through the ValidatorTimelock.',
    },
  ],
  milestones: [
    {
      name: 'ZKsync Protocol Upgrade v24',
      link: 'https://github.com/ZKsync-Community-Hub/zksync-developers/discussions/519',
      date: '2024-06-06T00:00:00Z',
      description:
        'A protocol upgrade that introduces a shared bridge and the foundation for other ZK stack chains.',
      type: 'general',
    },
    {
      name: 'ZKsync Era starts using blobs',
      link: 'https://twitter.com/zksync/status/1767983026443579448',
      date: '2024-03-13T00:00:00Z',
      description: 'ZKsync Era starts publishing data to blobs.',
      type: 'general',
    },
    {
      name: 'Introduction of Boojum prover',
      link: 'https://zksync.mirror.xyz/HJ2Pj45EJkRdt5Pau-ZXwkV2ctPx8qFL19STM5jdYhc',
      date: '2023-07-17T00:00:00Z',
      description: 'Deployment of Boojum - new high-performance proof system.',
      type: 'general',
    },
    {
      name: 'ZKsync 2.0 baby alpha launch',
      link: 'https://blog.matter-labs.io/baby-alpha-has-arrived-5b10798bc623',
      date: '2022-10-28T00:00:00Z',
      description: 'ZKsync 2.0 baby alpha is launched on mainnet.',
      type: 'general',
    },
    {
      name: 'Fair Onboarding Alpha and Rebranding',
      link: 'https://blog.matter-labs.io/all-aboard-zksync-era-mainnet-8b8964ba7c59',
      date: '2023-02-16T00:00:00Z',
      description:
        'ZKsync 2.0 rebrands to ZKsync Era and lets registered projects and developers deploy on mainnet.',
      type: 'general',
    },
    {
      name: 'Full Launch Alpha',
      link: 'https://blog.matter-labs.io/gm-zkevm-171b12a26b36',
      date: '2023-03-24T00:00:00Z',
      description: 'ZKsync Era is now permissionless and open for everyone.',
      type: 'general',
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
