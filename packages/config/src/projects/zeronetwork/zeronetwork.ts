import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('zeronetwork')
const v26UpgradeTS = UnixTime(1742860739)
const chainId = 543210

const bridge = discovery.getContract('L1NativeTokenVault')

export const zeronetwork: ScalingProject = zkStackL2({
  discovery,
  additionalBadges: [BADGES.RaaS.Caldera],
  addedAt: UnixTime(1731369600), // 2024-11-12T00:00:00Z
  display: {
    name: 'ZERO Network',
    slug: 'zeronetwork',
    description:
      'ZERO Network is an L2 by the Zerion wallet team, utilizing the ZK stack and native account abstraction, allowing Zerion wallet users gasless and prioritized transactions.',
    links: {
      websites: ['https://zero.network/'],
      bridges: [
        'https://bridge.zero.network/',
        'https://app.zerion.io/bridge?outputChain=zero&inputChain=ethereum',
      ],
      documentation: ['https://docs.zero.network/'],
      explorers: [
        'https://explorer.zero.network/',
        'https://zero-network.calderaexplorer.xyz/',
      ],
      socialMedia: [
        'https://x.com/ZEROdotnetwork',
        'https://zero.network/blog',
        'https://warpcast.com/~/channel/zero',
        'https://youtube.com/@ZERO-Network-L2',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  chainConfig: {
    name: 'zeronetwork',
    chainId,
    explorerUrl: 'https://explorer.zero.network',
    sinceTimestamp: UnixTime(1729616414),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.zerion.io/v1/zero',
        callsPerMinute: 1500,
      },
    ],
  },
  diamondContract: discovery.getContract('ZeroNetworkZkEvm'),
  usesEthereumBlobs: true,
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        chainId: 543210,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6edd4f12',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _lastCommittedBatchData, (uint64 batchNumber, uint64 timestamp, uint64 indexRepeatedStorageChanges, bytes32 newStateRoot, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 bootloaderHeapInitialContentsHash, bytes32 eventsQueueStateHash, bytes systemLogs, bytes pubdataCommitments)[] _newBatchesData)',
        sinceTimestamp: UnixTime(1729616414),
        untilTimestamp: v26UpgradeTS,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        chainId: 543210,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0xc37533bb',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId,(uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _prevBatch, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _committedBatches, (uint256[] recursiveAggregationInput, uint256[] serializedProof) _proof)',
        sinceTimestamp: UnixTime(1729616414),
        untilTimestamp: v26UpgradeTS,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        chainId: 543210,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6f497ac6',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _batchesData)',
        sinceTimestamp: UnixTime(1729616414),
        untilTimestamp: v26UpgradeTS,
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0x98f81962',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: v26UpgradeTS,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xe12a6137',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId, uint256, uint256, bytes)',
        sinceTimestamp: v26UpgradeTS,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xcf02827d',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: v26UpgradeTS,
      },
    },
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['ETH', 'USDC', 'WBTC', 'USDT'],
      description:
        'Shared bridge for depositing tokens to ZERϴ and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0x954ba8223a6BFEC1Cc3867139243A02BA0Bc66e4',
        ),
        l2EtherAddress: EthereumAddress(
          '0x000000000000000000000000000000000000800A',
        ),
      },
    }),
  ],
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://zero.network/blog/zer-mainnet-welcome-to-a-world-without-gas-fees',
      date: '2024-11-12T00:00:00Z',
      description: 'ZERϴ launches their mainnet.',
      type: 'general',
    },
  ],
})
