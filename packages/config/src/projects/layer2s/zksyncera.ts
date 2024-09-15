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
import { PROOFS } from '../other/zk-catalog/common/proofSystems'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zksync2')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)

const protVotingDelayS = discovery_ZKstackGovL2.getContractValue<number>(
  'ZkProtocolGovernor',
  'votingDelay',
)
const protVotingPeriodS = discovery_ZKstackGovL2.getContractValue<number>(
  'ZkProtocolGovernor',
  'votingPeriod',
)
const protTlMinDelayS = discovery_ZKstackGovL2.getContractValue<number>(
  'ProtocolTimelockController',
  'getMinDelay',
)
const tokenTlMinDelayS = discovery_ZKstackGovL2.getContractValue<number>(
  'TokenTimelockController',
  'getMinDelay',
)
const govOpsTlMinDelayS = discovery_ZKstackGovL2.getContractValue<number>(
  'GovOpsTimelockController',
  'getMinDelay',
)
const executionDelayS = discovery.getContractValue<number>(
  'ValidatorTimelock',
  'executionDelay',
)
const executionDelay = executionDelayS > 0 && formatSeconds(executionDelayS)
const executionDelayOldS = discovery.getContractValue<number>(
  'ValidatorTimelockOld',
  'executionDelay',
)
const executionDelayOld =
  executionDelayOldS > 0 && formatSeconds(executionDelayOldS)
const legalVetoStandardS = discovery.getContractValue<number>(
  'ProtocolUpgradeHandler',
  'STANDARD_LEGAL_VETO_PERIOD',
)
const legalVetoExtendedS = discovery.getContractValue<number>(
  'ProtocolUpgradeHandler',
  'EXTENDED_LEGAL_VETO_PERIOD',
)
const upgradeDelayPeriodS = discovery.getContractValue<number>(
  'ProtocolUpgradeHandler',
  'UPGRADE_DELAY_PERIOD',
)
const upgradeWaitOrExpireS = discovery.getContractValue<number>(
  'ProtocolUpgradeHandler',
  'UPGRADE_WAIT_OR_EXPIRE_PERIOD',
)
// protTlMinDelayS + executionDelayS + legalVetoExtendedS + upgradeDelayPeriodS
//       0                21h                7d                 1d         = 8d 21h
// assumption: active guardians (2/8)
const upgradeDelayWithScApprovalExtendedLegalVotingS =
  protTlMinDelayS + executionDelayS + legalVetoExtendedS + upgradeDelayPeriodS
const upgradeDelayWithScApprovalS =
  protTlMinDelayS + executionDelayS + legalVetoStandardS + upgradeDelayPeriodS
const upgradeDelayNoScS =
  protTlMinDelayS +
  executionDelayS +
  legalVetoStandardS +
  upgradeWaitOrExpireS +
  upgradeDelayPeriodS

const softFreezeS = discovery.getContractValue<number>(
  'ProtocolUpgradeHandler',
  'SOFT_FREEZE_PERIOD',
)
const hardFreezeS = discovery.getContractValue<number>(
  'ProtocolUpgradeHandler',
  'HARD_FREEZE_PERIOD',
)

const scMemberCount = discovery.getContractValue<string[]>(
  'SecurityCouncil',
  'members',
).length
const scApprovalThreshold = discovery.getContractValue<number>(
  'SecurityCouncil',
  'APPROVE_UPGRADE_SECURITY_COUNCIL_THRESHOLD',
)
const scMainThreshold = discovery.getContractValue<number>(
  'SecurityCouncil',
  'EIP1271_THRESHOLD',
)
const guardiansMemberCount = discovery.getContractValue<string[]>(
  'Guardians',
  'members',
).length
const guardiansMainThreshold = discovery.getContractValue<number>(
  'Guardians',
  'EIP1271_THRESHOLD',
)
const guardiansExtendThreshold = discovery.getContractValue<number>(
  'Guardians',
  'EXTEND_LEGAL_VETO_THRESHOLD',
)
const protocolStartProposalThresholdM =
  discovery_ZKstackGovL2.getContractValue<number>(
    'ZkProtocolGovernor',
    'proposalThreshold',
  ) / 1000000000000000000000000 // result: M of tokens
const tokenStartProposalThresholdM =
  discovery_ZKstackGovL2.getContractValue<number>(
    'ZkTokenGovernor',
    'proposalThreshold',
  ) / 1000000000000000000000000 // result: M of tokens
const govOpsStartProposalThresholdM =
  discovery_ZKstackGovL2.getContractValue<number>(
    'ZkGovOpsGovernor',
    'proposalThreshold',
  ) / 1000000000000000000000000 // result: M of tokens
const protocolQuorumM =
  discovery_ZKstackGovL2.getContractValue<number>(
    'ZkProtocolGovernor',
    'currentQuorum',
  ) / 1000000000000000000000000 // result: M of tokens
const tokenQuorumM =
  discovery_ZKstackGovL2.getContractValue<number>(
    'ZkProtocolGovernor',
    'currentQuorum',
  ) / 1000000000000000000000000 // result: M of tokens
const govOpsQuorumM =
  discovery_ZKstackGovL2.getContractValue<number>(
    'ZkProtocolGovernor',
    'currentQuorum',
  ) / 1000000000000000000000000 // result: M of tokens
const scThresholdString = `${scMemberCount} / ${scMainThreshold}`
const guardiansThresholdString = `${guardiansMemberCount} / ${guardiansMainThreshold}`

const upgrades = {
  upgradableBy: ['ProtocolUpgradeHandler'],
  upgradeDelay: `0 through the EmergencyUpgradeBoard, else ${formatSeconds(
    upgradeDelayWithScApprovalS,
  )}.`,
}

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

const validatorsOld = () => {
  // old validatorTL accepted validators in constructor
  const constructorArgsValis = discovery.getContractValue<{
    _validators: string[]
  }>('ValidatorTimelockOld', 'constructorArgs')

  const validatorsAdded = discovery
    .getContractValue<string[]>('ValidatorTimelockOld', 'validatorsAdded')
    .concat(constructorArgsValis._validators)

  const validatorsRemoved = discovery.getContractValue<string[]>(
    'ValidatorTimelockOld',
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
  badges: [
    Badge.VM.EVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.ZKStack,
    Badge.Other.L3HostChain,
    Badge.Infra.ElasticChain,
  ],
  display: {
    name: 'ZKsync Era',
    slug: 'zksync-era',
    warning: executionDelay
      ? `Withdrawals are delayed by ${executionDelay}. The length of the delay can be arbitrarily set by a MultiSig.`
      : undefined,
    description:
      'ZKsync Era is a general-purpose ZK Rollup with full EVM compatibility.',
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
        ? `ZKsync Era is a ZK rollup that posts state diffs to the L1. Transactions within a state diff can be considered final when proven on L1 using a ZK proof, except that an operator can revert them if not executed yet. Currently, there is at least a ${executionDelay} delay between state diffs verification and the execution of the corresponding state actions.`
        : undefined,
    },
    finality: {
      finalizationPeriod: executionDelayS,
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
    associatedTokens: ['ZK'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB'),
        tokens: '*',
        description:
          'Shared bridge for depositing tokens to ZKsync Era and, in the future, other ZK stack chains.',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x41527B2d03844dB6b0945f25702cB958b6d55989'),
        sinceTimestamp: new UnixTime(1698058151),
        tokens: ['wstETH'],
        description:
          'Bridge for depositing wrapped stETH (Lido) to ZKsync Era. These deposits and withdrawals do not go through the new shared BridgeHub.',
        upgradableBy: ['Lido (Lido Agent)'],
        upgradeDelay: 'No delay',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x32400084C286CF3E17e7B677ea9583e60a000324'),
        sinceTimestamp: new UnixTime(1676268575),
        tokens: ['ETH'],
        description: 'Main rollup contract of ZKsync Era.',
        ...upgrades,
        isHistorical: true,
        untilTimestamp: new UnixTime(1717922458),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063'),
        sinceTimestamp: new UnixTime(1676367083),
        tokens: '*',
        description:
          'Legacy bridge for depositing ERC20 tokens to ZKsync Era. Forwards deposits and withdrawals to the BridgeHub.',
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
          sinceTimestamp: new UnixTime(1701721931),
          untilTimestamp: new UnixTime(1710169104),
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
          sinceTimestamp: new UnixTime(1710169104),
          untilTimestamp: new UnixTime(1717681823),
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
          sinceTimestamp: new UnixTime(1717681823),
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
          sinceTimestamp: new UnixTime(1679602559),
          untilTimestamp: new UnixTime(1701718427),
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
          sinceTimestamp: new UnixTime(1701258299),
          untilTimestamp: new UnixTime(1710165419),
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
          sinceTimestamp: new UnixTime(1710165419),
          untilTimestamp: new UnixTime(1717694375),
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
          sinceTimestamp: new UnixTime(1717694375),
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
          sinceTimestamp: new UnixTime(1679602559),
          untilTimestamp: new UnixTime(1701719687),
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
          sinceTimestamp: new UnixTime(1701258299),
          untilTimestamp: new UnixTime(1710167255),
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
          sinceTimestamp: new UnixTime(1710167255),
          untilTimestamp: new UnixTime(1717683407),
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
          sinceTimestamp: new UnixTime(1717683407),
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
    explorerUrl: 'https://era.zksync.network/',
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
      ...RISK_VIEW.EXIT_WINDOW_ZKSTACK(upgradeDelayWithScApprovalS),
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
      ...RISK_VIEW.PROPOSER_WHITELIST_GOVERNANCE,
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
        fraudProofSystemIsPermissionless: null,
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
  upgradesAndGovernance: (() => {
    const description = `
    There are two main paths for contract upgrades in the shared ZK stack ecosystem - standard and emergency - both converging on the shared upgrade proxy contract ProtocolUpgradeHandler. 
    The standard path involves a governance proposal and voting through the DAO, multiple timelock delays and finally approval by the Guardians or ${scApprovalThreshold} SecurityCouncil participants. 
    The emergency path allows for contract upgrades without any delay by the EmergencyUpgradeBoard, which acts as a 3/3 Multisig between SecurityCouncil, Guardians and the FoundationMultisig.
    
    **The standard path:** Delegates can start new proposals by reaching a threshold of ${protocolStartProposalThresholdM}M ZK tokens on the ZKsync Era Rollup's ZkProtocolGovernor contract.
    This launches a ${formatSeconds(
      protVotingDelayS,
    )} 'voting delay' after which the ${formatSeconds(protVotingPeriodS)} voting period starts. During these first two periods, the proposal can be canceled by the proposer or if it falls below the proposing threshold.
    A proposal is only successful if it reaches both quorum (${protocolQuorumM}M ZK tokens) and simple majority. When it reaches quorum, the voting period is reset to ${formatSeconds(
      protVotingPeriodS,
    )}. 
    In the successful case, it can be queued in the ${formatSeconds(
      protTlMinDelayS,
    )} timelock which forwards it to Ethereum as an L2->L1 log. 
    
    After the execution of the proposal-containing batch (${executionDelay} delay), the proposal is now picked up by the ProtocolUpgradeHandler and enters the ${formatSeconds(
      legalVetoStandardS,
    )} 'legal veto period'.
    This serves as a window in which a veto could be coordinated offchain, to be then enforced by non-approval of Guardians and SecurityCoucil. A threshold of ${guardiansExtendThreshold} Guardians can extend the veto period to ${formatSeconds(
      legalVetoExtendedS,
    )}. 
    After this a proposal enters a \*waiting\* state of ${formatSeconds(
      upgradeWaitOrExpireS,
    )}, from which it can be immediately approved (cancelling the delay) by ${scApprovalThreshold} participants of the SecurityCouncil. 
    For the unlikely case that the SC does not approve here, the Guardians can instead approve the proposal, or nobody. In the two latter cases, the waiting period is enforced in full. 
    A proposal cannot be actively cancelled in the ProtocolUpgradeHandler, but will be expired if not approved within the waiting period. An approved proposal now enters the \*pendingExecution\* state for a final delay of 1d, and can then be executed.
    
    There are two other tracks of Governance also starting with DAO Delegate proposals the ZKsync Era rollup: 1) Token Program Proposals that add new minters, allocations or upgrade the ZK token and 
    2) Governance Advisory Proposals that e.g. change the ZK Credo or other offchain Governance Procedures without onchain targets. 
    The protocol for these two other tracks is similar to the first part of the standard path described above (albeit having different quorum and timelock values), and not passing over to the Ethereum L1. 
    Further customizations are that the ZkFoundationMultisig can propose to the ZkTokenGovernor without a threshold and that the Guardians' L2 alias can cancel proposals in the ZkTokenGovernor and the ZkGovOpsGovernor.
    
    **The emergency path:** SecurityCouncil (${scThresholdString}), Guardians (${guardiansThresholdString}) and ZkFoundationMultisig (${discovery.getMultisigStats(
      'ZkFoundationMultisig',
    )}) form a de-facto 3/3 Multisig 
    by pushing an immediate upgrade proposal through the EmergencyUpgradeBoard, which circumvents all delays and executes immediately via the ProtocolUpgradeHandler.
    
    The cumulative duration of the upgrade paths from the moment of a voted 'successful' proposal is ${formatSeconds(
      upgradeDelayWithScApprovalS,
    )} - ${formatSeconds(
      upgradeDelayWithScApprovalExtendedLegalVotingS,
    )} (depending on Guardians extending the LegalVetoPeriod) for Standard, 0 for Emergency and ${formatSeconds(
      upgradeDelayNoScS,
    )} for the path in which the SecurityCouncil is not approving the proposal.
    
    The SecurityCouncil can freeze (pause withdrawals and settlement) all chains connected to the current StateTransitionManager. 
    Either for a softFreeze of ${formatSeconds(
      softFreezeS,
    )} or a hardFreeze of ${formatSeconds(hardFreezeS)}. 
    After a sofrFreeze and / or a hardFreeze, a proposal from the EmergencyUpgradeBoard has to be passed before subsequent freezes are possible. 
    Only the SecurityCouncil can unfreeze an active freeze.
    
    Apart from the paths that can upgrade all shared implementations, the ZK stack governance system defines other roles that can modify the system: 
    A single *Admin* role that governs parameters in the shared contracts and a (Chain-)*Admin* role (in the chain-specific diamond contract) for managing parameters of each individual Hyperchain that builds on the stack.
    These chain-specific actions include setting a transaction filterer that can censor L1 -> L2 messages, setting fee parameters and adding / removing Validators in the ValidatorTimelock. 
    ZKsync Era's ChainAdmin differs from the others as it also receives the above *Admin* (not upgradeability admin) role in the shared ZK stack contracts.
    `
    return description
  })(),
  permissions: [
    discovery.contractAsPermissioned(
      discovery.getContract('SecurityCouncil'),
      `One of the three signers of the EmergencyUpgradeBoard. Can freeze all ZK stack chains. Can approve governance proposals in the ProtocolUpgradeHandler. The default threshold for the members of this contract is ${scThresholdString} but is customized for certain actions.`,
    ),
    {
      name: 'SecurityCouncil members',
      accounts: discovery.getPermissionedAccounts('SecurityCouncil', 'members'),
      description: `Members of the SecurityCouncil. The members are mostly low-threshold multisigs themselves. `,
      references: [
        {
          text: 'Security Council members - ZK Nation docs',
          href: 'https://docs.zknation.io/zksync-governance/schedule-3-zksync-security-council',
        },
      ],
    },
    discovery.contractAsPermissioned(
      discovery.getContract('Guardians'),
      `Is one of the three signers of the EmergencyUpgradeBoard. Can extend the legal veto period and / or approve governance proposals in the ProtocolUpgradeHandler. Permissioned to cancel non-protocolUpgrade proposals on L2. The default threshold for the members of this contract is ${guardiansThresholdString} but is customized for certain actions.`,
    ),
    {
      name: 'ZKsync Guardians',
      accounts: discovery.getPermissionedAccounts('Guardians', 'members'),
      description: `Members of the Guardians contract, usually 1/1 Gnosis multisigs themselves. `,
      references: [
        {
          text: 'ZKsync Guardians - ZK Nation docs',
          href: 'https://docs.zknation.io/zksync-governance/schedule-4-zksync-guardians',
        },
      ],
    },
    ...discovery.getMultisigPermission(
      'ZkFoundationMultisig',
      'Is one of the three signers of the EmergencyUpgradeBoard.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('ProtocolUpgradeHandler'),
      'Owner and upgrade Admin of all shared ZK stack contracts. Can also upgrade the individual Hyperchain diamond contracts.',
    ),
    ...discovery.getMultisigPermission(
      'Matter Labs Multisig',
      'Has the Admin role in the ZKsync Era and the shared contracts through the ChainAdmin contract.',
    ),
    {
      name: 'ChainAdmin Owner',
      accounts: [discovery.getPermissionedAccount('ChainAdmin', 'owner')],
      description:
        'Can add new Chains, manage fees, apply predefined upgrades, censor bridge transactions and revert batches (*Admin* role).', // era ChainAdmin specific
    },
    {
      name: 'ZKsync Validators',
      accounts: [
        ...discovery.getPermissionedAccounts(
          'ZKsync',
          'validatorsAddedManually',
        ),
        ...discovery.getPermissionedAccounts(
          'ZKsync',
          'validatorsAddedViaEvent',
        ),
      ],
      description:
        'Addresses permissioned to call the functions to propose, execute and revert L2 batches in the ZKsync Era diamond. Usually these are addresses of ValidatorTimelock contracts.',
    },
    {
      name: 'ValidatorTimelock Validators',
      accounts: validators().map((v) => discovery.formatPermissionedAccount(v)),
      description:
        'Actors that are allowed to propose, execute and revert L2 batches on L1 through the ValidatorTimelock.',
    },
    {
      name: 'ValidatorTimelockOld Validators',
      accounts: validatorsOld().map((v) =>
        discovery.formatPermissionedAccount(v),
      ),
      description:
        'Actors that are allowed to propose, execute and revert L2 batches on L1 through the currently unused ValidatorTimelockOld.',
    },
  ],
  nativePermissions: {
    zksync2: [
      {
        accounts: [
          {
            address: EthereumAddress(
              '0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D',
            ),
            type: 'EOA',
          },
        ],
        name: 'ZkFoundationMultisig L2 alias',
        description:
          'The Layer2 alias adress through which the ZkFoundationMultisig can act.',
      },
      {
        accounts: [
          {
            address: EthereumAddress(
              '0xe788e09324F8bb3cc64f009973693f751C33b999',
            ),
            type: 'EOA',
          },
        ],
        name: 'Guardians L2 alias',
        description:
          'The Layer2 alias adress through which the Guardians contract can act.',
      },
      {
        accounts: [
          {
            address: EthereumAddress(
              '0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8',
            ),
            type: 'EOA',
          },
        ],
        name: 'ProtocolUpgradeHandler L2 alias',
        description:
          'The Layer2 alias adress through which the ProtocolUpgradeHandler contract can act.',
      },
      {
        accounts: [
          discovery_ZKstackGovL2.getPermissionedAccount(
            'ZkTokenGovernor',
            'VETO_GUARDIAN',
          ),
        ],
        name: 'Veto Guardian TokenGovernor',
        description:
          'This address can cancel proposals in the ZkTokenGovernor while they are pending (after having been proposed) or active (during the voting period).',
      },
      {
        accounts: [
          discovery_ZKstackGovL2.getPermissionedAccount(
            'ZkTokenGovernor',
            'PROPOSE_GUARDIAN',
          ),
        ],
        name: 'Propose Guardian TokenGovernor',
        description: `This address can make direct proposals in the ZkTokenGovernor without owning ZK tokens${
          discovery_ZKstackGovL2.getContractValue<boolean>(
            'ZkTokenGovernor',
            'isProposeGuarded',
          )
            ? '. This is the only address permissioned to make proposals'
            : ''
        }.`,
      },
      {
        accounts: [
          discovery_ZKstackGovL2.getPermissionedAccount(
            'ZkTokenProxyAdmin',
            'owner',
          ),
        ],
        name: 'ZK Token upgrade Admin',
        description:
          'Can upgrade the ZK token contract, affecting all holders of the ZK token.',
      },
      {
        accounts: discovery_ZKstackGovL2.getAccessControlRolePermission(
          'ZkToken',
          'MINTER_ADMIN_ROLE',
        ),
        name: 'ZK Token minter Admin',
        description:
          'Can add and remove minters from the ZK token contract and mint unlimited amounts.',
      },
      {
        accounts: [
          discovery_ZKstackGovL2.getPermissionedAccount(
            'ZkGovOpsGovernor',
            'VETO_GUARDIAN',
          ),
        ],
        name: 'Veto Guardian GovOpsGovernor',
        description:
          'This address can cancel proposals in the ZkGovOpsGovernor while they are pending (after having been proposed) or active (during the voting period).',
      },
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
      discovery.getContractDetails('ChainAdmin', {
        description:
          'Intermediary governance contract that has the *Admin* (not upgradeability admin) role for the shared contracts and for ZKsync Era.',
      }),
      discovery.getContractDetails(
        'ValidatorTimelock',
        `Intermediary contract between the *Validators* and the ZKsync Era diamond that delays block execution (ie withdrawals and other L2 --> L1 messages) by ${executionDelay}.`,
      ),
      discovery.getContractDetails(
        'ValidatorTimelockOld',
        `Intermediary contract between the *Validators* and the ZKsync Era diamond that delays block execution (ie withdrawals and other L2 --> L1 messages) by ${executionDelayOld}.`,
      ),
      discovery.getContractDetails('Verifier', {
        description: 'Implements ZK proof verification logic.',
      }),
      discovery.getContractDetails(
        'SecurityCouncil',
        `Custom contract acting as a Multisig. The default threshold for the members of this contract is ${scThresholdString} but is customized for certain actions.`,
      ),
      discovery.getContractDetails(
        'Guardians',
        `Custom contract acting as a Multisig. The default threshold for the members of this contract is ${guardiansThresholdString} but is customized for certain actions.`,
      ),
      discovery.getContractDetails(
        'ProtocolUpgradeHandler',
        'The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard.',
      ),
      discovery.getContractDetails('L1SharedBridge', {
        description:
          'This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.',
        ...upgrades,
      }),
      discovery.getContractDetails('BridgeHub', {
        description:
          'Sits between the single shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.',
        ...upgrades,
      }),
      discovery.getContractDetails('StateTransitionManager', {
        description:
          'Defines L2 diamond contract creation and upgrade data, proof verification for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).',
        ...upgrades,
      }),
    ],
    nativeAddresses: {
      zksync2: [
        discovery_ZKstackGovL2.getContractDetails(
          'ZkProtocolGovernor',
          `Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that go through Ethereum Layer 1 and can target all L1 and L2 contracts. At least ${protocolStartProposalThresholdM}M ZK tokens are necessary to start a proposal and a ${protocolQuorumM}M quorum of voted tokens must be met to succeed. Can queue and execute proposals in the ProtocolTimelockController.`,
        ),
        discovery_ZKstackGovL2.getContractDetails(
          'ProtocolTimelockController',
          `Timelock contract that can send L2->L1 logs that start a proposal in the ProtocolUpgradeHandler on Ethereum. This timelock has ${
            protTlMinDelayS > 0 ? formatSeconds(protTlMinDelayS) : 'no'
          } minimum delay`,
        ),
        discovery_ZKstackGovL2.getContractDetails(
          'ZkTokenGovernor',
          `Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token. At least ${tokenStartProposalThresholdM}M ZK tokens are necessary to start a proposal (for delegates) and a ${tokenQuorumM}M quorum of voted tokens must be met to succeed. Can queue and execute proposals in the TokenTimelockController.`,
        ),
        discovery_ZKstackGovL2.getContractDetails(
          'TokenTimelockController',
          `This timelock contract has ${
            tokenTlMinDelayS > 0 ? formatSeconds(tokenTlMinDelayS) : 'no'
          } minimum delay`,
        ),
        discovery_ZKstackGovL2.getContractDetails(
          'ZkGovOpsGovernor',
          `Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least ${govOpsStartProposalThresholdM}M ZK tokens are necessary to start a proposal and a ${govOpsQuorumM}M quorum of voted tokens must be met to succeed. Can queue and execute proposals in the GovOpsTimelockController.`,
        ),
        discovery_ZKstackGovL2.getContractDetails(
          'GovOpsTimelockController',
          `This timelock contract has ${
            govOpsTlMinDelayS > 0 ? formatSeconds(govOpsTlMinDelayS) : 'no'
          } minimum delay`,
        ),
        discovery_ZKstackGovL2.getContractDetails('ZkToken', {
          description:
            'The ZK token contract on ZKsync Era. Used for voting in the ZK stack governance system.',
          ...upgrades,
        }),
      ],
    },
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK_WITH_EXCEPTION(
        // a bit hacky, but re-using the function from arbitrum (3 cases: standard (with or without extension by Guardians), emergency)
        `${formatSeconds(upgradeDelayWithScApprovalS)} - ${formatSeconds(
          upgradeDelayWithScApprovalExtendedLegalVotingS,
        )}`,
        'EmergencyUpgradeBoard',
      ),
    ],
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
      shortDescription: 'ZKsync Era is a ZK-EVM rollup on Ethereum.',
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
              ...PROOFS.PLONKSNARK('Aztec ceremony'),
              link: 'https://github.com/matter-labs/era-zkevm_test_harness/blob/v1.5.0/circuit_definitions/src/circuit_definitions/aux_layer/wrapper.rs',
            },
            {
              name: 'Aggregation circuit',
              proofSystem: 'Redshift',
              mainArithmetization: 'Plonkish',
              mainPCS: 'LPC',
              trustedSetup: 'None',
              link: 'https://github.com/matter-labs/era-zkevm_test_harness/blob/v1.5.0/circuit_definitions/src/circuit_definitions/recursion_layer/mod.rs#L45',
            },
            {
              name: 'Main circuit',
              proofSystem: 'Redshift',
              mainArithmetization: 'Plonkish',
              mainPCS: 'LPC',
              trustedSetup: 'None',
              link: 'https://github.com/matter-labs/era-zkevm_circuits',
            },
          ],
        },
      ],
    },
  },
  milestones: [
    {
      name: 'Onhchain Governance Launch',
      link: 'https://blog.zknation.io/zksync-governance-system/',
      date: '2024-09-12T00:00:00Z',
      description:
        'An onchain Governance system is introduced, including a Security Council and Guardians.',
      type: 'general',
    },
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
