import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('treasure')
const chainId = 61166
const trackedTxsSince = UnixTime(1742933423)
const v26UpgradeTS = UnixTime(1742933423)
const bridge = discovery.getContract('L1NativeTokenVault')

export const treasure: ScalingProject = zkStackL2({
  discovery,
  additionalBadges: [BADGES.DA.CustomDA],
  addedAt: UnixTime(1733875200), // 2024-12-11T00:00:00Z
  archivedAt: UnixTime(1752676593), // 2025-07-16T15:36:00Z
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Treasure',
    slug: 'treasure',
    headerWarning:
      'The project had a planned shutdown after a [governance vote](https://snapshot.box/#/s:treasuregaming.eth/proposal/0x733799d525cec0794f157cbace52851b28809706eb87d51472dac8584949d791).',
    description:
      'Treasure is a gaming-specific L2 built on ZKsync, the Elastic Network. Treasure offers an end-to-end tech stack for developers and consumer apps to build the next generation of gaming.',
    links: {
      websites: ['https://treasure.lol/'],
      bridges: ['https://app.treasure.lol'],
      documentation: ['https://docs.treasure.lol'],
      explorers: ['https://treasurescan.io'],
      repositories: ['https://github.com/TreasureProject'],
      socialMedia: [
        'https://x.com/Treasure_DAO',
        'https://discord.gg/treasuredao',
        'https://youtube.com/@PlayOnTreasure',
        'https://t.me/playontreasure',
      ],
    },
  },
  associatedTokens: ['MAGIC'],
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  chainConfig: {
    name: 'treasure',
    chainId,
    explorerUrl: 'https://treasurescan.io',
    sinceTimestamp: UnixTime(1732617294),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.treasure.lol',
        callsPerMinute: 1500,
      },
    ],
  },
  diamondContract: discovery.getContract('TreasureZkEvm'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['MAGIC'],
      description:
        'Shared bridge for depositing tokens to Treasure and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0xfC1d5dCD080121DaAF366625581ad490414EF294',
        ),
        l2EtherAddress: EthereumAddress(
          '0x650BE505C391d396A1e0b1f2337EaE77F064fF7f', // unverified
        ),
        tokensToAssignFromL1: ['MAGIC'], // will apparently be bridged externally at a later point
      },
    }),
  ],
  daProvider: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    riskView: RISK_VIEW.DATA_EXTERNAL,
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted onchain by the centralized Sequencer.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          title: 'ExecutorFacet - _commitOneBatch() function',
          url: 'https://etherscan.io/address/0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800#code#F1#L46',
        },
      ],
    },
  },
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        chainId,
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
        chainId,
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
        chainId,
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
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/Treasure_DAO/status/1865101292752040255',
      date: '2024-12-11T00:00:00Z',
      description: 'Treasure mainnet launches for all users.',
      type: 'general',
    },
  ],
})
