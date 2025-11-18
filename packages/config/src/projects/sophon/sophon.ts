import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('sophon')
const chainId = 50104
const trackedTxsSince = UnixTime(1742940287)
const v26UpgradeTS = UnixTime(1743095267)
const v29UpgradeTS = UnixTime(1761612755)
const diamond = discovery.getContract('SophonZkEvm')
const bridge = discovery.getContract('L1NativeTokenVault')
const isL2AssetRouterWhitelisted =
  discovery.getContractValue<ChainSpecificAddress[]>(
    'SophonTransactionFilterer',
    'whitelistedContractsAC',
  )[0] ===
  ChainSpecificAddress('eth:0x0000000000000000000000000000000000010003')
const assetBridgingWhitelistedText = isL2AssetRouterWhitelisted
  ? ' The L2AssetRouter contract is currently whitelisted as a target in the TransactionFilterer which allows users to queue withdrawals that use the canonical bridge from L1.'
  : ''

export const sophon: ScalingProject = zkStackL2({
  discovery,
  additionalBadges: [BADGES.DA.AvailVector],
  addedAt: UnixTime(1734480000), // 2024-12-18T00:00:00Z
  display: {
    name: 'Sophon',
    slug: 'sophon',
    architectureImage: 'zkstack-validium-vector',
    description:
      'Sophon is a consumer-centric ecosystem on a ZK Stack Validium L2, designed to bring onchain benefits to everyday lifestyle and entertainment applications.',
    links: {
      websites: ['https://sophon.xyz/'],
      bridges: ['https://portal.sophon.xyz/', 'https://farm.sophon.xyz/'],
      documentation: ['https://docs.sophon.xyz/sophon'],
      explorers: ['https://explorer.sophon.xyz/', 'https://sophscan.xyz/'],
      repositories: ['https://github.com/sophon-org'],
      socialMedia: [
        'https://x.com/sophon',
        'https://blog.sophon.xyz/',
        'https://t.me/SophonHub',
        'https://t.me/SophonAnnouncements',
        'https://discord.com/invite/sophon',
      ],
    },
  },
  overridingPurposes: ['Gaming', 'Social', 'AI'],
  associatedTokens: ['SOPH'],
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  chainConfig: {
    name: 'sophon',
    chainId,
    gasTokens: ['SOPH'],
    explorerUrl: 'https://explorer.sophon.xyz',
    sinceTimestamp: UnixTime(1729531437),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.sophon.xyz/',
        callsPerMinute: 300,
      },
    ],
  },
  diamondContract: diamond,
  daProvider: {
    layer: DA_LAYERS.AVAIL,
    riskView: RISK_VIEW.DATA_AVAIL(true),
    technology: {
      ...TECHNOLOGY_DATA_AVAILABILITY.AVAIL_OFF_CHAIN(true),
      references: [
        {
          title: 'AvailL1DAValidator - checkDA() function',
          url: 'https://etherscan.io/address/0x8f50d93B9955B285f787043B30B5F51D09bE0120#code#F1#L16',
        },
      ],
    },
    bridge: DA_BRIDGES.VECTOR,
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: [
        'ETH',
        'USDT',
        'BEAM',
        'stAethir',
        'PEPE',
        'wstETH',
        'weETH',
        'sDAI',
        'DAI',
        'WBTC',
        'stAZUR',
        'stAVAIL',
        'OPN',
        'SOPH',
      ],
      premintedTokens: ['SOPH'],
      description:
        'Shared bridge for depositing tokens to Treasure and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0x954ba8223a6BFEC1Cc3867139243A02BA0Bc66e4',
        ),
        l2EtherAddress: EthereumAddress(
          '0x72af9F169B619D85A47Dfa8fefbCD39dE55c567D',
        ),
        tokensToAssignFromL1: ['SOPH'],
      },
    }),
  ],
  availDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    appIds: ['17', '36', '37', '38'],
  },
  nonTemplateRiskView: {
    sequencerFailure: {
      value: 'No mechanism',
      description:
        'There is no mechanism to have transactions be included if the sequencer is down or censoring. The Operator actively uses a TransactionFilterer contract, which requires accounts that enqueue or force transactions from L1 OR their targets on L2, to be whitelisted.',
      sentiment: 'bad',
    },
  },
  nonTemplateTechnology: {
    forceTransactions: {
      name: "Users can't force all transactions",
      description:
        'If a user is censored by the L2 Sequencer, they cannot by default force their transaction via the L1 queue. An active TransactionFilterer contract which allows only whitelisted accounts to enqueue, prevents it. Even if a user was specifically whitelisted, there is no mechanism that forces the L2 Sequencer to include\
            transactions from the queue in an L2 block, as they have the choice to process the queue in order or not at all.' +
        assetBridgingWhitelistedText,
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the operator refuses to include their transactions.',
        },
        {
          category: 'Users can be censored if',
          text: 'the Operator does not specifically whitelist them in the TransactionFilterer.',
        },
      ],
      references: [
        {
          title: "L1 - L2 interoperability - Developer's documentation",
          url: 'https://docs.zksync.io/zksync-protocol/rollup/l1_l2_communication#priority-operations-1',
        },
        {
          title: 'Mailbox facet',
          url: 'https://etherscan.io/address/0x1e34aB39a9682149165ddeCc0583d238A5448B45#code#F1#L405',
        },
        {
          title: 'TransactionFilterer',
          url: 'https://etherscan.io/address/0x9D06B34adc3026eF876e4DABb859C424DbDA3063#code#F1#L34',
        },
      ],
    },
  },
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
        sinceTimestamp: trackedTxsSince,
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
        sinceTimestamp: trackedTxsSince,
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
        sinceTimestamp: trackedTxsSince,
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
      title: 'SOPH TGE',
      url: 'https://x.com/sophon/status/1927697463655219692', // TODO better announcement link
      date: '2025-05-28T00:00:00.00Z',
      description: 'SOPH, the gas token of Sophon, is officially live.',
      type: 'general',
    },
    {
      title: 'Avail Vector DA Bridge',
      url: 'https://blog.availproject.org/avail-to-power-consumer-entertainment-onchain-with-sophon/', // TODO better announcement link
      date: '2025-04-23T00:00:00.00Z',
      description:
        'Sophon is the first validium to integrate with the Vector data availability bridge to Avail.',
      type: 'general',
    },
    {
      title: 'Mainnet public launch',
      url: 'https://x.com/sophon/status/1861771965284896996',
      date: '2024-12-18T00:00:00Z',
      description: 'Sophon Mainnet is now open for all users.',
      type: 'general',
    },
    {
      title: 'Mainnet private launch',
      url: 'https://blog.sophon.xyz/the-road-to-mainnet/',
      date: '2024-09-22T00:00:00Z',
      description: 'Sophon launches their mainnet privately.',
      type: 'general',
    },
  ],
})
