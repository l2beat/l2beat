import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
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
const bridge = discovery.getContract('L1NativeTokenVault')

export const sophon: ScalingProject = zkStackL2({
  discovery,
  additionalBadges: [BADGES.DA.Avail], // TODO ADD AVAIL + VECTOR BADGE
  addedAt: UnixTime(1734480000), // 2024-12-18T00:00:00Z
  display: {
    name: 'Sophon',
    slug: 'sophon',
    description:
      'Sophon is a consumer-centric ecosystem on a ZK Stack Validium L2, designed to bring onchain benefits to everyday lifestyle and entertainment applications.',
    links: {
      websites: ['https://sophon.xyz/'],
      apps: ['https://portal.sophon.xyz/', 'https://farm.sophon.xyz/'],
      documentation: ['https://docs.sophon.xyz/sophon'],
      explorers: ['https://explorer.sophon.xyz/'],
      repositories: ['https://github.com/sophon-org'],
      socialMedia: [
        'https://x.com/sophon',
        'https://blog.sophon.xyz/',
        'https://t.me/SophonHub',
        'https://discord.gg/sophonhub',
      ],
    },
  },
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
        callsPerMinute: 1500,
      },
    ],
  },
  diamondContract: discovery.getContract('SophonZkEvm'),
  daProvider: {
    layer: DA_LAYERS.AVAIL,
    riskView: RISK_VIEW.DATA_AVAIL(false),
    technology: {
      ...TECHNOLOGY_DATA_AVAILABILITY.AVAIL_OFF_CHAIN(false),
      references: [
        {
          title: 'ExecutorFacet - _commitOneBatch() function',
          url: 'https://etherscan.io/address/0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800#code#F1#L46',
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
      ], // 'SOPH' not on CG yet
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
        tokensToAssignFromL1: [], // 'SOPH' not on CG yet
      },
    }),
  ],
  availDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    appId: '17',
  },
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
        sinceTimestamp: trackedTxsSince,
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
        sinceTimestamp: trackedTxsSince,
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
        sinceTimestamp: trackedTxsSince,
      },
    },
  ],
  milestones: [
    {
      title: 'Avail VectorX DA Bridge',
      url: 'https://blog.availproject.org/avail-to-power-consumer-entertainment-onchain-with-sophon/', // TODO better announcement link
      date: '2025-04-23T00:00:00.00Z',
      description:
        'Sophon is the first validium to integrate with the VectorX data availability bridge to Avail.',
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
