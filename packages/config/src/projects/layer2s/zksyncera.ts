import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { ESCROW } from '../../common/escrow'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Upgradeability, zkStackL2 } from './templates/zkStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zksync2')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const shared = new ProjectDiscovery('shared-zk-stack')
const bridge = shared.getContract('L1SharedBridge')

const executionDelayOldS = discovery.getContractValue<number>(
  'ValidatorTimelockOld',
  'executionDelay',
)
const executionDelayOld =
  executionDelayOldS > 0 && formatSeconds(executionDelayOldS)

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

export const zksyncera: Layer2 = zkStackL2({
  createdAt: new UnixTime(1671115151), // 2022-12-15T14:39:11Z
  discovery,
  discovery_ZKstackGovL2,
  validatorsEvents: {
    added: `zksyncValidatorsAdded`,
    removed: 'zksyncValidatorsRemoved',
  },
  additionalBadges: [Badge.Other.L3HostChain],
  display: {
    name: 'ZKsync Era',
    slug: 'zksync-era',
    description:
      'ZKsync Era is a general-purpose ZK Rollup with full EVM compatibility.',
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
  },
  diamondContract: discovery.getContract('ZKsync'),
  chainConfig: {
    name: 'zksync2',
    chainId: 324,
    explorerUrl: 'https://era.zksync.network/',
    explorerApi: {
      url: 'https://api-era.zksync.network/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1676384520),
    multicallContracts: [
      {
        version: '3',
        address: EthereumAddress('0xF9cda624FBC7e059355ce98a31693d299FACd963'),
        batchSize: 150,
        sinceBlock: 3908235,
      },
    ],
    coingeckoPlatform: 'zksync',
  },
  associatedTokens: ['ZK'],
  nonTemplateEscrows: (zkStackUpgrades: Upgradeability) => [
    shared.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      description:
        'Shared bridge for depositing tokens to ZKsync Era and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0x11f943b2c77b743AB90f4A0Ae7d5A4e7FCA3E102',
        ),
        l2EtherAddress: EthereumAddress(
          '0x000000000000000000000000000000000000800A',
        ),
      },
      ...zkStackUpgrades,
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x41527B2d03844dB6b0945f25702cB958b6d55989'),
      sinceTimestamp: new UnixTime(1698058151),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
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
      ...zkStackUpgrades,
      isHistorical: true,
      untilTimestamp: new UnixTime(1717922458),
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063'),
      sinceTimestamp: new UnixTime(1676367083),
      tokens: '*',
      description:
        'Legacy bridge for depositing ERC20 tokens to ZKsync Era. Forwards deposits and withdrawals to the BridgeHub.',
      ...zkStackUpgrades,
    }),
  ],
  rpcUrl: 'https://mainnet.era.zksync.io',

  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xa0425d71cB1D6fb80E65a5361a04096E0672De03'),
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
        address: EthereumAddress('0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD'),
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
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6edd4f12',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment), (uint64 batchNumber, uint64 timestamp, uint64 indexRepeatedStorageChanges, bytes32 newStateRoot, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 bootloaderHeapInitialContentsHash, bytes32 eventsQueueStateHash, bytes systemLogs, bytes pubdataCommitments)[] _newBatchesData)',
        sinceTimestamp: new UnixTime(1717681823),
        untilTimestamp: new UnixTime(1722410363), // first cronoszkevm batch commit to the shared ValidatorTimelock https://etherscan.io/tx/0x9c69ea744cdfa74e328234f546b4313dab448d2126a2a1c4dda706f9d233c3a5
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        chainId: 324,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6edd4f12',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _lastCommittedBatchData, (uint64 batchNumber, uint64 timestamp, uint64 indexRepeatedStorageChanges, bytes32 newStateRoot, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 bootloaderHeapInitialContentsHash, bytes32 eventsQueueStateHash, bytes systemLogs, bytes pubdataCommitments)[] _newBatchesData)',
        sinceTimestamp: new UnixTime(1722410363),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x3dB52cE065f728011Ac6732222270b3F2360d919'),
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
        address: EthereumAddress('0xa0425d71cB1D6fb80E65a5361a04096E0672De03'),
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
        address: EthereumAddress('0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD'),
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
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0xc37533bb',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment), (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[], (uint256[] recursiveAggregationInput, uint256[] serializedProof))',
        sinceTimestamp: new UnixTime(1717694375),
        untilTimestamp: new UnixTime(1722410363),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        chainId: 324,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0xc37533bb',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId,(uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _prevBatch, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _committedBatches, (uint256[] recursiveAggregationInput, uint256[] serializedProof) _proof)',
        sinceTimestamp: new UnixTime(1722410363),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x3dB52cE065f728011Ac6732222270b3F2360d919'),
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
        address: EthereumAddress('0xa0425d71cB1D6fb80E65a5361a04096E0672De03'),
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
        address: EthereumAddress('0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD'),
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
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6f497ac6',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _newBatchesData)',
        sinceTimestamp: new UnixTime(1717683407),
        untilTimestamp: new UnixTime(1722410363),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        chainId: 324,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6f497ac6',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _batchesData)',
        sinceTimestamp: new UnixTime(1722410363),
      },
    },
  ],
  finality: {
    type: 'zkSyncEra',
    stateUpdate: 'zeroed',
    minTimestamp: new UnixTime(1708556400),
    lag: 0,
  },
  nonTemplatePermissions: [
    {
      name: 'ChainAdmin Owner',
      accounts: [
        discovery.getPermissionedAccount('EraChainAdminProxy', 'owner'),
      ],
      description:
        'Can manage fees, apply predefined upgrades and censor bridge transactions (*ChainAdmin* role).',
    },
    {
      name: 'ValidatorTimelockOld Validators',
      accounts: validatorsOld().map((v) =>
        discovery.formatPermissionedAccount(v),
      ),
      fromRole: true,
      description:
        'Actors that are allowed to propose, execute and revert L2 batches on L1 through the currently unused ValidatorTimelockOld.',
    },
  ],
  nonTemplateContracts: (zkStackUpgrades: Upgradeability) => [
    discovery.getContractDetails('ZKsync', {
      description:
        'The main Rollup contract. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract \
          then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.',
      ...zkStackUpgrades,
    }),
    discovery.getContractDetails('EraChainAdminProxy', {
      description:
        'Intermediary governance contract proxies the *Elastic Chain Operator* role for the shared contracts and the *ChainAdmin* role for ZKsync Era.',
    }),
    discovery.getContractDetails(
      'ValidatorTimelockOld',
      `Intermediary contract between the *Validators* and the ZKsync Era diamond that delays block execution (ie withdrawals and other L2 --> L1 messages) by ${executionDelayOld}.`,
    ),
  ],
  milestones: [
    {
      name: 'Onchain Governance Launch',
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
  knowledgeNuggets: [],
})
