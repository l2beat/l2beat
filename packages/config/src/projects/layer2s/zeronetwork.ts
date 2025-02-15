import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { type Upgradeability, zkStackL2 } from './templates/zkStack'

const discovery = new ProjectDiscovery('zeronetwork')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const bridge = discovery.getContract('L1SharedBridge')

export const zeronetwork: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  additionalBadges: [Badge.RaaS.Caldera],
  addedAt: new UnixTime(1721214420), // 2024-07-17T11:07:00Z
  display: {
    name: 'ZERO Network',
    slug: 'zeronetwork',
    description:
      'ZERO Network is an L2 by the Zerion wallet team, utilizing the ZK stack and native account abstraction, allowing Zerion wallet users gasless and prioritized transactions.',
    links: {
      websites: ['https://zero.network/'],
      apps: [
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
  rpcUrl: 'https://rpc.zerion.io/v1/zero',
  chainConfig: {
    name: 'zeronetwork',
    chainId: 543210,
    explorerUrl: 'https://explorer.zero.network',
    minTimestampForTvl: new UnixTime(1729616414),
  },
  diamondContract: discovery.getContract('ZeroNetworkZkEvm'),
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        chainId: 543210,
        address: discovery.getContract('ValidatorTimelock').address,
        selector: '0x6edd4f12',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _lastCommittedBatchData, (uint64 batchNumber, uint64 timestamp, uint64 indexRepeatedStorageChanges, bytes32 newStateRoot, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 bootloaderHeapInitialContentsHash, bytes32 eventsQueueStateHash, bytes systemLogs, bytes pubdataCommitments)[] _newBatchesData)',
        sinceTimestamp: new UnixTime(1729616414),
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
        address: discovery.getContract('ValidatorTimelock').address,
        selector: '0xc37533bb',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId,(uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _prevBatch, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _committedBatches, (uint256[] recursiveAggregationInput, uint256[] serializedProof) _proof)',
        sinceTimestamp: new UnixTime(1729616414),
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
        address: discovery.getContract('ValidatorTimelock').address,
        selector: '0x6f497ac6',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _batchesData)',
        sinceTimestamp: new UnixTime(1729616414),
      },
    },
  ],
  nonTemplateEscrows: (zkStackUpgrades: Upgradeability) => [
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
      ...zkStackUpgrades,
    }),
  ],
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://zero.network/blog/zer-mainnet-welcome-to-a-world-without-gas-fees',
      date: '2024-11-12T00:00:00Z',
      description: 'ZERϴ launches their mainnet.',
      type: 'general',
    },
  ],
})
