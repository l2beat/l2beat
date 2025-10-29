import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const genesisTimestamp = UnixTime(1729881083)
const v26UpgradeTS = UnixTime(1742940287)
const v29UpgradeTS = UnixTime(1761601727)
const chainId = 2741
const discovery = new ProjectDiscovery('abstract')

const bridge = discovery.getContract('L1NativeTokenVault')
const diamond = discovery.getContract('AbstractZkEvm')

export const abstract: ScalingProject = zkStackL2({
  addedAt: UnixTime(1737936000), // 2025-01-27T00:00:00Z
  display: {
    name: 'Abstract',
    slug: 'abstract',
    description:
      'Abstract is a ZK Rollup built on top of Ethereum using the ZK stack, designed to securely power consumer-facing blockchain applications at scale with low fees and fast transaction speeds.',
    links: {
      websites: ['https://abs.xyz/'],
      bridges: [
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
      rollupCodes: 'https://rollup.codes/abstract',
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  chainConfig: {
    name: 'abstract',
    chainId,
    explorerUrl: 'https://abscan.org',
    sinceTimestamp: genesisTimestamp,
    coingeckoPlatform: 'abstract',
    apis: [
      { type: 'etherscan', chainId },
      { type: 'rpc', url: 'https://api.mainnet.abs.xyz', callsPerMinute: 300 },
    ],
  },
  discovery,
  diamondContract: discovery.getContract('AbstractZkEvm'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['ETH', 'YGG'],
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
    }),
  ],
  usesEthereumBlobs: true,
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: ChainSpecificAddress.address(diamond.address),
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x0b6db820',
        functionSignature:
          'function precommitSharedBridge(address _chainAddress, uint256, bytes)',
        sinceTimestamp: v29UpgradeTS,
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6edd4f12',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _lastCommittedBatchData, (uint64 batchNumber, uint64 timestamp, uint64 indexRepeatedStorageChanges, bytes32 newStateRoot, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 bootloaderHeapInitialContentsHash, bytes32 eventsQueueStateHash, bytes systemLogs, bytes pubdataCommitments)[] _newBatchesData)',
        sinceTimestamp: genesisTimestamp,
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
        firstParameter: chainId,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0xc37533bb',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId,(uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _prevBatch, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _committedBatches, (uint256[] recursiveAggregationInput, uint256[] serializedProof) _proof)',
        sinceTimestamp: genesisTimestamp,
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
        firstParameter: chainId,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6f497ac6',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _batchesData)',
        sinceTimestamp: genesisTimestamp,
        untilTimestamp: v26UpgradeTS,
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0x98f81962',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: v26UpgradeTS,
        untilTimestamp: v29UpgradeTS,
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: ChainSpecificAddress.address(diamond.address),
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x0db9eb87',
        functionSignature:
          'function commitBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: v29UpgradeTS,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xe12a6137',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId, uint256, uint256, bytes)',
        sinceTimestamp: v26UpgradeTS,
        untilTimestamp: v29UpgradeTS,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: ChainSpecificAddress.address(diamond.address),
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x9271e450',
        functionSignature:
          'function proveBatchesSharedBridge(address _chainAddress, uint256, uint256, bytes)',
        sinceTimestamp: v29UpgradeTS,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xcf02827d',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: v26UpgradeTS,
        untilTimestamp: v29UpgradeTS,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: ChainSpecificAddress.address(diamond.address),
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0xa085344d',
        functionSignature:
          'function executeBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: v29UpgradeTS,
      },
    },
  ],
  milestones: [
    {
      title: 'Liveness failure (batch 16529)',
      url: 'https://dashboard.tenderly.co/tx/0xcaefda7f4c6e29f90b34a0b68817feeb9fac3da2cb66538ea15fbeed434a7201/state-diff',
      date: '2025-05-14T00:00:00Z',
      description:
        'Unprovable batch halts finalization for 2 days, resolved by verifier-overriding emergency upgrade.',
      type: 'incident',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/AbstractChain/status/1883939915169423777',
      date: '2025-01-27T00:00:00Z',
      description: 'Abstract launches their mainnet, opening for all users.',
      type: 'general',
    },
  ],
})
