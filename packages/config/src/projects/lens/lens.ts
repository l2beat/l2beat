import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('lens')
const chainId = 232
const trackedTxsSince = UnixTime(1742928599)
const bridge = discovery.getContract('L1NativeTokenVault')

export const lens: ScalingProject = zkStackL2({
  capability: 'universal',
  additionalPurposes: ['Social'],
  additionalBadges: [BADGES.DA.Avail],
  addedAt: UnixTime(1716536821), // 2024-05-24T07:47:01Z
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Lens',
    slug: 'lens',
    description:
      "Lens Network is the main social networking hub for the user base of Lens Protocol, built on a Validium using ZKsync's ZK Stack technology.",
    stack: 'ZK Stack',
    links: {
      websites: ['https://lens.xyz'],
      apps: [
        'https://app.across.to/bridge?destinationChainId=232',
        'https://onboarding.lens.xyz/explore',
      ],
      documentation: ['https://lens.xyz/docs'],
      explorers: ['https://momoka.lens.xyz', 'https://explorer.lens.xyz/'],
      repositories: ['https://github.com/lens-protocol'],
      socialMedia: [
        'https://hey.xyz/u/lens',
        'https://x.com/LC',
        'https://discord.com/invite/lensprotocol',
      ],
    },
  },
  discovery,
  diamondContract: discovery.getContract('LensZkEvm'),
  chainConfig: {
    name: 'lens',
    chainId,
    explorerUrl: '',
    sinceTimestamp: UnixTime(1740140786),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.lens.xyz',
        callsPerMinute: 1500,
      },
    ],
    gasTokens: ['LGHO'],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['LGHO', 'ETH', 'USDC'],
      description:
        'Shared bridge for depositing tokens to Lens and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0x8116A750e2091B2bA0D94223e7b20a6A65A279f4',
        ),
        l2EtherAddress: EthereumAddress(
          '0xE5ecd226b3032910CEaa43ba92EE8232f8237553',
        ),
        tokensToAssignFromL1: ['LGHO'],
      },
    }),
  ],
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
    bridge: DA_BRIDGES.NONE,
  },
  availDa: {
    sinceBlock: 1180000, // avail block number, roughly 04/03 right before mainnet launch (chain was active before)
    appId: '26',
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
      title: 'Mainnet Launch',
      url: 'https://lens.xyz/news/build-socialfi-apps-faster-with-lens-now-on-mainnet',
      date: '2025-04-04T00:00:00Z',
      description: 'Lens mainnet launches for all users.',
      type: 'general',
    },
  ],
})
