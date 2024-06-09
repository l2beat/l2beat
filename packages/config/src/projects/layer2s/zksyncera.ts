import {
  assert,
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
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zksync2')

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
    'validatorsAdded',
  )
  const validatorsRemoved = discovery.getContractValue<string[]>(
    'ValidatorTimelock',
    'validatorsRemoved',
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

export const zksyncera: Layer2 = {
  type: 'layer2',
  id: ProjectId('zksync2'),
  display: {
    name: 'zkSync Era',
    slug: 'zksync-era',
    warning: executionDelay
      ? `Withdrawals are delayed by ${executionDelay}. The length of the delay can be arbitrarily set by a MultiSig.`
      : undefined,
    description:
      'zkSync Era is a general-purpose ZK Rollup with full EVM compatibility.',
    purposes: ['Universal'],
    provider: 'ZK Stack',
    category: 'ZK Rollup',
    links: {
      websites: ['https://zksync.io/', 'https://zksync.dappradar.com/'],
      apps: ['https://portal.zksync.io/bridge/'],
      documentation: ['https://docs.zksync.io/'],
      explorers: [
        'https://explorer.zksync.io/',
        'https://era.zksync.network/',
        'https://zksync-era.l2scan.co/',
        'https://zksync.blockscout.com/',
        'https://hyperscan.xyz/',
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
      explanation: executionDelay
        ? `zkSync Era is a ZK rollup that posts state diffs to the L1. Transactions within a state diff can be considered final when proven on L1 using a ZK proof, except that an operator can revert them if not executed yet. Currently, there is at least a ${executionDelay} delay between state diffs verification and the execution of the corresponding state actions.`
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
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB'),
        tokens: '*',
        description:
          'Shared bridge for depositing tokens to zkSync Era and, in the future, other ZK stack chains.',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x41527B2d03844dB6b0945f25702cB958b6d55989'),
        sinceTimestamp: new UnixTime(1698058151),
        tokens: ['wstETH'],
        description:
          'Bridge for depositing wrapped stETH (Lido) to zkSync Era. These deposits and withdrawals do not go through the new shared BridgeHub.',
        upgradableBy: ['Lido (Lido Agent)'],
        upgradeDelay: 'No delay',
      }),
      {
        ...discovery.getEscrowDetails({
          address: EthereumAddress(
            '0x32400084C286CF3E17e7B677ea9583e60a000324',
          ),
          sinceTimestamp: new UnixTime(1676268575),
          tokens: ['ETH'],
          description: 'Main rollup contract of zkSync Era.',
          ...upgrades,
        }),
        isHistorical: true,
        untilTimestamp: new UnixTime(1717922458),
      },
      discovery.getEscrowDetails({
        address: EthereumAddress('0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063'),
        sinceTimestamp: new UnixTime(1676367083),
        tokens: '*',
        description:
          'Legacy bridge for depositing ERC20 tokens to zkSync Era. Forwards deposits and withdrawals to the BridgeHub.',
        ...upgrades,
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://mainnet.era.zksync.io',
      defaultCallsPerMinute: 1500,
      startBlock: 1,
    },
    trackedTxs: [
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa0425d71cB1D6fb80E65a5361a04096E0672De03',
          ),
          selector: '0x701f58c5',
          functionSignature:
            'function commitBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32), (uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])',
          sinceTimestampInclusive: new UnixTime(1701721931),
          untilTimestampExclusive: new UnixTime(1710169104),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD',
          ),
          selector: '0x701f58c5',
          functionSignature:
            'function commitBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32), (uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])',
          sinceTimestampInclusive: new UnixTime(1710169104),
          untilTimestampExclusive: new UnixTime(1717681823),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E',
          ),
          selector: '0x6edd4f12',
          functionSignature:
            'function commitBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment), (uint64 batchNumber, uint64 timestamp, uint64 indexRepeatedStorageChanges, bytes32 newStateRoot, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 bootloaderHeapInitialContentsHash, bytes32 eventsQueueStateHash, bytes systemLogs, bytes pubdataCommitments)[] _newBatchesData)',
          sinceTimestampInclusive: new UnixTime(1717681823),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x3dB52cE065f728011Ac6732222270b3F2360d919',
          ),
          selector: '0x7739cbe7',
          functionSignature:
            'function proveBlocks((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32) calldata,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[] calldata,(uint256[],uint256[]) calldata)',
          sinceTimestampInclusive: new UnixTime(1679602559),
          untilTimestampExclusive: new UnixTime(1701718427),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa0425d71cB1D6fb80E65a5361a04096E0672De03',
          ),
          selector: '0x7f61885c',
          functionSignature:
            'function proveBatches(tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32), tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32)[], tuple(uint256[], uint256[]))',
          sinceTimestampInclusive: new UnixTime(1701258299),
          untilTimestampExclusive: new UnixTime(1710165419),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD',
          ),
          selector: '0x7f61885c',
          functionSignature:
            'function proveBatches(tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32), tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32)[], tuple(uint256[], uint256[]))',
          sinceTimestampInclusive: new UnixTime(1710165419),
          untilTimestampExclusive: new UnixTime(1717694375),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E',
          ),
          selector: '0xc37533bb',
          functionSignature:
            'function proveBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment), (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[], (uint256[] recursiveAggregationInput, uint256[] serializedProof))',
          sinceTimestampInclusive: new UnixTime(1717694375),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x3dB52cE065f728011Ac6732222270b3F2360d919',
          ),
          selector: '0xce9dcf16',
          functionSignature:
            'function executeBlocks((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[] calldata _newBlocksData)',
          sinceTimestampInclusive: new UnixTime(1679602559),
          untilTimestampExclusive: new UnixTime(1701719687),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa0425d71cB1D6fb80E65a5361a04096E0672De03',
          ),
          selector: '0xc3d93e7c',
          functionSignature:
            'function executeBatches(tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32)[] _newBatchesData)',
          sinceTimestampInclusive: new UnixTime(1701258299),
          untilTimestampExclusive: new UnixTime(1710167255),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD',
          ),
          selector: '0xc3d93e7c',
          functionSignature:
            'function executeBatches(tuple(uint64, bytes32, uint64, uint256, bytes32, bytes32, uint256, bytes32)[] _newBatchesData)',
          sinceTimestampInclusive: new UnixTime(1710167255),
          untilTimestampExclusive: new UnixTime(1717683407),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E',
          ),
          selector: '0x6f497ac6',
          functionSignature:
            'function executeBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _newBatchesData)',
          sinceTimestampInclusive: new UnixTime(1717683407),
        },
      },
    ],
    finality: {
      type: 'zkSyncEra',
      stateUpdate: 'zeroed',
      minTimestamp: new UnixTime(1708556400),
      lag: 0,
    },
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
          contract: 'zkSync',
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
          contract: 'zkSync',
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
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a#code#F1#L114', // upgradeChainFromVersion() onlyAdminOrStateTransitionManager
            'https://etherscan.io/address/0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a#code#F1#L128', // executeUpgrade() onlyStateTransitionManager
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
          contract: 'zkSync',
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
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
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
          href: 'https://docs.zksync.io/build/developer-reference/l1-l2-interoperability#priority-queue',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://docs.zksync.io/build/developer-reference/bridging-assets',
          },
        ],
      },
      EXITS.FORCED('forced-withdrawals'),
    ],
  },
  upgradesAndGovernance: (() => {
    assert(
      !isSCset,
      'There is a Security Council set up for zkSync Era. Change the governance description to reflect that.',
    )
    const description = `
    The Matter Labs multisig (${discovery.getMultisigStats(
      'Matter Labs Multisig',
    )}) is able to instantly upgrade all contracts and manage all parameters and roles. This includes upgrading the shared contracts, the \`zkSync Era diamond\` and its facets and censoring transactions or stealing locked funds. Most permissions are inherited by being the *Owner* of the \`StateTransitionManager\` (*STM*). A security council is currently not used.
    
    The current deployment allows for a subset of the permissions currently held by the *Matter Labs Multisig* to be held by an *Admin* role. 
    This role can manage fees, apply predefined upgrades, censor bridge transactions and revert batches. It cannot make arbitrary updates or access funds in the escrows. 
    
    Other roles include:
    
    *Validator:* Proposes batches from L2 into the \`ValidatorTimelock\`, from where they can be proven and finally executed (through the \`ExecutorFacet\` of the diamond) after a predefined delay (currently ${formatSeconds(
      discovery.getContractValue('ValidatorTimelock', 'executionDelay'),
    )}). This allows for freezing the L2 chain and reverting batches within the delay if any suspicious activity was detected. The \`ValidatorTimelock\` holds the single *Validator* role in the zkSync Era diamond and can be set by the *Matter Labs Multisig* through the *STM*. The actual *Validator* actors can be added and removed by the *Admin* in the \`ValidatorTimelock\` contract.
    
    *Verifier:* Verifies the zk proofs that were provided by a *Validator*. Can be changed by calling \`executeUpgrade()\` on the \`AdminFacet\` from the *STM*.
    
    A \`Governance\` smart contract is used as the intermediary for most of the critical permissions of the *Matter Labs Multisig*. It includes logic for planning upgrades with parameters like transparency and/or a delay. 
    ${
      discovery.getContractValue<number>('Governance', 'minDelay') === 0
        ? 'Currently the delay is optional and not used by the multisig.'
        : `Currently the minimum delay is ${formatSeconds(
            discovery.getContractValue('Governance', 'minDelay'),
          )}.`
    }
    The optional transparency may be used in the future to hide instant emergency upgrades by the *Security Council* or delay transparent (thus auditable) governance upgrades. The \`Governance\` smart contract has two roles, an *owner* (*Matter Labs Multisig*) role and a *securityCouncil* role.
`
    return description
  })(),
  contracts: {
    addresses: [
      discovery.getContractDetails('zkSync', {
        description:
          'The main Rollup contract. Operator commits blocks and provides a ZK proof which is validated by the Verifier contract \
          then processes transactions (executes batches). During batch execution it processes L1 --> L2 and L2 --> L1 transactions.',
        ...upgrades,
      }),
      discovery.getContractDetails('Governance', {
        description: `Intermediary governance contract with two roles and a customizable delay. 
        This delay is only mandatory for transactions scheduled by the Owner role and can be set by the Security Council role. 
        The Security Council role can execute arbitrary transactions immediately. 
        Currently the delay is set to ${formatSeconds(
          discovery.getContractValue<number>('Governance', 'minDelay'),
        )}
        ${isSCset ? '.' : ' and the Security Council role is not used.'}`,
        ...upgrades,
      }),
      discovery.getContractDetails(
        'ValidatorTimelock',
        'Intermediary contract between the validators and the zkSync Era diamond proxy that delays block execution (ie withdrawals and other L2 --> L1 messages).',
      ),
      discovery.getContractDetails('Verifier', {
        description: 'Implements ZK proof verification logic.',
        ...upgrades,
        upgradeConsiderations:
          'Multisig can change the verifier with no delay.',
      }),
      discovery.getContractDetails('L1SharedBridge', {
        description:
          'This bridge contract escrows all ERC-20s and ETH that are deposited to zkSync Era - and in the future - other registered ZK stack chains.',
        ...upgrades,
      }),
      discovery.getContractDetails('BridgeHub', {
        description:
          'Sits between the single shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.',
        ...upgrades,
      }),
      discovery.getContractDetails('StateTransitionManager', {
        description:
          'Defines rollup creation, upgrade and proof verification for the zkSync diamond contract connected to it (and potential other rollup contracts that opt in to share this logic).',
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
          name: 'zkSyncEraVerifier',
          description:
            'zkSync Era utilizes [Boojum](https://github.com/matter-labs/era-boojum/tree/main) as the main proving stack for their system. Boojum is an implementation of the [Redshift](https://eprint.iacr.org/2019/1400.pdf) protocol. The protocol makes use of recursive proof aggregation. The final Redshift proof is wrapped in a SNARK (Plonk + KZG) proof.',
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
            },
            {
              name: 'Aggregation circuit',
              proofSystem: 'Redshift',
              mainArithmetization: 'Plonk',
              mainPCS: 'LPC',
              link: 'https://github.com/matter-labs/era-zkevm_test_harness/blob/v1.5.0/circuit_definitions/src/circuit_definitions/recursion_layer/mod.rs#L45',
            },
            {
              name: 'Main circuit',
              proofSystem: 'Redshift',
              mainArithmetization: 'Plonk',
              mainPCS: 'LPC',
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
      name: 'Validators',
      accounts: validators().map((v) => discovery.formatPermissionedAccount(v)),
      description:
        'Actors that are allowed to propose, execute and revert L2 batches on L1 through the ValidatorTimelock.',
    },
  ],
  milestones: [
    {
      name: 'zkSync Protocol Upgrade v24',
      link: 'https://github.com/zkSync-Community-Hub/zksync-developers/discussions/519',
      date: '2024-06-06T00:00:00Z',
      description:
        'A protocol upgrade that introduces a shared bridge and the foundation for other ZK stack chains.',
    },
    {
      name: 'zkSync Era starts using blobs',
      link: 'https://twitter.com/zksync/status/1767983026443579448',
      date: '2024-03-13T00:00:00Z',
      description: 'zkSync Era starts publishing data to blobs.',
    },
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
