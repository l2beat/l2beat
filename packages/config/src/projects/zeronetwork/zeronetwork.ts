import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('zeronetwork')
const v26UpgradeTS = UnixTime(1742860739)
const v29UpgradeTS = UnixTime(1783512011)
// https://etherscan.io/tx/0x2133c718664d820546ee503c0a34b604a76c62d2e9db79cc28c122194dd0c613
const v29UpgradeBlock = 25487710
const chainId = 543210
const eraValidatorMsAddress = ChainSpecificAddress.address(
  discovery.getContract('EraMultisigValidator').address,
)
const diamondAddress = ChainSpecificAddress.address(
  discovery.getContract('Diamond').address,
)

const bridge = discovery.getContract('L1NativeTokenVault')

export const zeronetwork: ScalingProject = zkStackL2({
  chainId,
  discovery,
  additionalBadges: [BADGES.RaaS.Caldera],
  addedAt: UnixTime(1731369600), // 2024-11-12T00:00:00Z
  display: {
    name: 'ZERO Network',
    slug: 'zeronetwork',
    headerWarning:
      'ZERO Network is sunsetting. See the [announcement](https://x.com/zerodotnetwork/status/2057529610628128917) and make sure to bridge off your funds until July 31, 2026. Deposits are disabled.',
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
  zkVerifierContractsReproducible: true,
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
        callsPerMinute: 300,
      },
    ],
  },
  usesEthereumBlobs: true,
  nonTemplateDaTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 21809364,
      untilBlock: v29UpgradeBlock,
      inbox: EthereumAddress('0x8c0Bfc04AdA21fd496c55B8C50331f904306F564'),
      sequencers: [
        EthereumAddress('0x479B7c95b9509E1A834C994fc94e3581aA8A73B9'),
        EthereumAddress('0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F'),
        EthereumAddress('0xef854E09fa6e281268e1051D4d5465d8c92862ee'),
        EthereumAddress('0x7b55c1D9b75Fa35793157aD674b0a1aEF7b8DdE0'),
      ],
    },
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: v29UpgradeBlock,
      inbox: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
      calls: [
        {
          selector: '0x0db9eb87',
          firstParameter: diamondAddress,
        },
      ],
    },
  ],
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
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
        firstParameter: chainId,
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
        firstParameter: chainId,
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
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: diamondAddress,
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x0db9eb87',
        functionSignature:
          'function commitBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: v29UpgradeTS,
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: diamondAddress,
        address: eraValidatorMsAddress,
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
        firstParameter: diamondAddress,
        address: eraValidatorMsAddress,
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
        firstParameter: diamondAddress,
        address: eraValidatorMsAddress,
        selector: '0xa085344d',
        functionSignature:
          'function executeBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: v29UpgradeTS,
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
