import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { type Upgradeability, zkStackL2 } from './templates/zkStack'

const genesisTimestamp = new UnixTime(1729881083)
const chainId = 2741
const discovery = new ProjectDiscovery('abstract')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const bridge = discovery.getContract('L1SharedBridge')

export const abstract: Layer2 = zkStackL2({
  addedAt: new UnixTime(1724863689), // 2024-08-28T16:48:09Z
  display: {
    name: 'Abstract',
    slug: 'abstract',
    description:
      'Abstract is a ZK Rollup built on top of Ethereum using the ZK stack, designed to securely power consumer-facing blockchain applications at scale with low fees and fast transaction speeds.',
    links: {
      websites: ['https://abs.xyz/'],
      apps: [
        'https://jumper.exchange/?toChain=2741&toToken=0x0000000000000000000000000000000000000000',
      ],
      documentation: ['https://docs.abs.xyz/'],
      explorers: ['https://abscan.org'],
      repositories: ['https://github.com/Abstract-Foundation'],
      socialMedia: [
        'https://x.com/abstractchain',
        'https://discord.com/invite/abstractchain',
        'https://x.com/Abstract_Eco',
        'https://t.me/abstract_chain',
        'https://youtube.com/@AbstractBlockchain',
      ],
    },
  },
  rpcUrl: 'https://api.mainnet.abs.xyz',
  chainConfig: {
    name: 'abstract',
    chainId,
    explorerUrl: 'https://abscan.org',
    explorerApi: {
      url: 'https://api.abscan.org/api',
      type: 'etherscan',
    },
    minTimestampForTvl: genesisTimestamp,
    coingeckoPlatform: 'abstract',
  },
  discovery,
  discovery_ZKstackGovL2,
  diamondContract: discovery.getContract('AbstractZkEvm'),
  nonTemplateEscrows: (zkStackUpgrades: Upgradeability) => [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['ETH'], // just assuming here, since USDC, USDT are stargate-routed and we want to reduce strain on TVS sync
      description:
        'Shared bridge for depositing tokens to Abstract and other ZK stack chains.',
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
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        chainId,
        address: discovery.getContract('ValidatorTimelock').address,
        selector: '0x6edd4f12',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _lastCommittedBatchData, (uint64 batchNumber, uint64 timestamp, uint64 indexRepeatedStorageChanges, bytes32 newStateRoot, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 bootloaderHeapInitialContentsHash, bytes32 eventsQueueStateHash, bytes systemLogs, bytes pubdataCommitments)[] _newBatchesData)',
        sinceTimestamp: genesisTimestamp,
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
        address: discovery.getContract('ValidatorTimelock').address,
        selector: '0xc37533bb',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId,(uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _prevBatch, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _committedBatches, (uint256[] recursiveAggregationInput, uint256[] serializedProof) _proof)',
        sinceTimestamp: genesisTimestamp,
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
        address: discovery.getContract('ValidatorTimelock').address,
        selector: '0x6f497ac6',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _batchesData)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://x.com/AbstractChain/status/1883939915169423777',
      date: '2025-01-27T00:00:00Z',
      description: 'Abstract launches their mainnet, opening for all users.',
      type: 'general',
    },
  ],
})
