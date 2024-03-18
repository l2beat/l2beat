import {
  assert,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  addSentimentToDataAvailability,
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
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
  upgradableBy: ['Matter Labs Multisig'],
  upgradeDelay: 'No delay',
}

const upgradeDelay = 0

const constructorArgs = discovery.getContractValue<{ _validators: string[] }>(
  'ValidatorTimelock',
  'constructorArgs',
)
const validatorsAdded = discovery.getContractValue<string[]>(
  'ValidatorTimelock',
  'validatorsAdded',
)
const validatorsRemoved = discovery.getContractValue<string[]>(
  'ValidatorTimelock',
  'validatorsRemoved',
)

/** todo(miszke)
 * This could be a separate handler.
 * It can happen that if a validator is added and then removed and then added again,
 * it will not appear on the list.
 */
const validators = constructorArgs._validators
  .concat(validatorsAdded)
  .filter((v) => !validatorsRemoved.includes(v))

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
      'zkSync Era is a general-purpose ZK Rollup with full EVM compatibility.',
    purposes: ['Universal'],
    provider: 'ZK Stack',
    category: 'ZK Rollup',
    links: {
      websites: ['https://zksync.io/', 'https://ecosystem.zksync.io/'],
      apps: ['https://bridge.zksync.io/', 'https://portal.zksync.io/'],
      documentation: ['https://era.zksync.io/docs/'],
      explorers: [
        'https://explorer.zksync.io/',
        'https://era.zksync.network/',
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
    finality: {
      finalizationPeriod: executionDelay,
      warning:
        'Proven but not executed batches can be reverted by the validator.',
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
          untilTimestamp: new UnixTime(1710165419),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD',
          ),
          selector: '0x7f61885c',
          functionSignature:
            'function proveBatches(tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32), tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32)[], tuple(uint256[], uint256[]))',
          sinceTimestamp: new UnixTime(1710165419),
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
          untilTimestamp: new UnixTime(1710167255),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD',
          ),
          selector: '0xc3d93e7c',
          functionSignature:
            'function executeBatches(tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32)[] _newBatchesData)',
          sinceTimestamp: new UnixTime(1710167255),
        },
      ],
    },
    finality: {
      type: 'zkSyncEra',
      minTimestamp: new UnixTime(1708556400),
      lag: 0,
    },
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
            'https://etherscan.io/address/0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD#code#F1#L102',
          ],
        },
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0xfd3779e6214eBBd40f5F5890351298e123A46BA6#code#F7#L377',
            'https://etherscan.io/address/0x10113bB3a8e64f8eD67003126adC8CE74C34610c#code#F5#L33',
          ],
        },
        {
          contract: 'Verifier',
          references: [
            'https://etherscan.io/address/0xdd9C826196cf3510B040A8784D85aE36674c7Ed2#code#F2#L345',
          ],
        },
      ],
      otherReferences: [
        'https://docs.zksync.io/zk-stack/concepts/transaction-lifecycle.html#transaction-types',
        'https://era.zksync.io/docs/dev/developer-guides/system-contracts.html#executorfacet',
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
      sources: [
        {
          contract: 'ValidatorTimelock',
          references: [
            'https://etherscan.io/address/0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD#code#F1#L102',
            'https://etherscan.io/tx/0x90f6a9c90842d7db4eb8a64731d2ae9224b2a754077b30200e67689b517f18e5', // example tx (see calldata)
            // todo: add blob example
          ],
        },
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0xfd3779e6214eBBd40f5F5890351298e123A46BA6#code#F7#L54',
            'https://etherscan.io/address/0xfd3779e6214eBBd40f5F5890351298e123A46BA6#code#F7#L57',
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
            'https://etherscan.io/address/0x230214F0224C7E0485f348a79512ad00514DB1F7#code#F5#L106',
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
            'https://etherscan.io/address/0x10113bB3a8e64f8eD67003126adC8CE74C34610c#code#F5#L63',
            'https://etherscan.io/address/0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7#code#F10#L194',
          ],
        },
      ],
      otherReferences: [
        'https://docs.zksync.io/build/developer-reference/l1-l2-interop.html#priority-queue',
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0xfd3779e6214eBBd40f5F5890351298e123A46BA6#code#F7#L198',
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
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
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
  upgradesAndGovernance: (() => {
    const discoveredSecurityCouncilAddress = discovery.getContractValue<string>(
      'Governance',
      'securityCouncil',
    )
    assert(
      discoveredSecurityCouncilAddress ===
        '0x0000000000000000000000000000000000000000',
      'There is a security council set up for zkSync Era. Change the governance description to reflect that.',
    )
    const description = `
Currently, the Matter Labs multisig (${discovery.getMultisigStats('Matter Labs Multisig')}) is able to instantly upgrade all contracts (including the diamond and its facets) and roles (including the *Governor* role). The *Governor* role that resolves to the multisig is the highest permissioned role defined in the system.

*Governor:* Can access all \`AdminFacet\` functions and thus upgrade the diamond and the related smart contract system. Additionally inherits access to functions for the *Admin* role. Can freeze all freezable Facets (currently \`ExecutorFacet\`, \`MailboxFacet\`) and upgrade the bridges. 

*Validator:* Proposes batches from L2 into the \`ValidatorTimelock\`, from where they can be proven and finally executed (through the \`ExecutorFacet\` of the diamond) after a predefined delay (currently ${formatSeconds(discovery.getContractValue('ValidatorTimelock', 'executionDelay'))}). This allows for freezing the L2 chain within the delay if any suspicious activity was detected. Can be set by the *Admin* or *Governor*. 

*Verifier:* Verifies the zk proofs that were provided by the Validator. Can be changed by calling \`ExecuteUpgrade()\` on the \`AdminFacet\` from the *Governor* role. 

*Admin:* Currently **not set**. Will be able to make non-critical changes like setting the *Validator*. Will be the role of the multisig when higher permissions are restricted to the *Security Council*.

*Security Council:* Currently **not set**. Will share the *Governor* role of the main diamond with the Matter Labs multisig through the Governance smart contract (see below).

A \`Governance\` smart contract is set up as the *Governor* role of the diamond. It includes logic for planning upgrades with parameters like transparency and/or a delay. Currently the delay is optional (minimum delay = ${formatSeconds(discovery.getContractValue('Governance', 'minDelay'))}) and not used by the multisig. The optional transparency may be used in the future to hide instant emergency upgrades by the *Security Council* or delay transparent (thus auditable) governance upgrades. The \`Governance\` smart contract has two roles, an *owner* role and a *securityCouncil* role.
`
    return description
  })(),
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Prover Architecture',
        description:
          'zkSync Era proof system Boojum can be found [here](https://github.com/matter-labs/era-boojum/tree/main) and contains essential tools like the Prover, the Verifier, and other backend components. The specs of the system can be found [here](https://github.com/matter-labs/zksync-era/tree/main/docs/specs/prover).',
      },
      {
        title: 'ZK Circuits',
        description:
          'zkSync Era circuits are built from Boojum and are designed to replicate the behavior of the EVM. The source code can be found [here](https://github.com/matter-labs/era-zkevm_circuits/tree/main). The circuits are checked against tests that can be found [here](https://github.com/matter-labs/era-zkevm_test_harness/tree/main).',
      },
      {
        title: 'Verification Keys Generation',
        description:
          'SNARK verification keys can be generated and checked against the Ethereum verifier contract using [this tool](https://github.com/matter-labs/zksync-era/tree/main/prover/vk_setup_data_generator_server_fri). The system requires a trusted setup.',
      },
    ],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Matter Labs Multisig',
      'This MultiSig is the current Governor of zkSync Era main contract and owner of the L1EthBridge. It can upgrade zkSync Era, upgrade bridge, change rollup parameters with no delay.',
    ),
    {
      name: 'Validators',
      accounts: validators.map((v) => discovery.formatPermissionedAccount(v)),
      description:
        'Those actors are allowed to propose, revert and execute L2 blocks on L1.',
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
