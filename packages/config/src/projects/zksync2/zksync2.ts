import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { ESCROW } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('zksync2')
const bridge = discovery.getContract('L1NativeTokenVault')

const chainId = 324
// https://etherscan.io/tx/0x2829993f6183647fc954ec75b67441ab0e597f445a3f5d6f976733775ca06f26#eventlog
const l1migrationTs = UnixTime(1769897051) // 2023-11-03T00:32:11Z

export const zksync2: ScalingProject = zkStackL2({
  chainId,
  addedAt: UnixTime(1679616000), // 2023-03-24T00:00:00Z
  additionalBadges: [BADGES.Other.Governance],
  discovery,
  display: {
    name: 'ZKsync Era',
    slug: 'zksync-era',
    description:
      'ZKsync Era is a general-purpose ZK Rollup with full EVM compatibility.',
    links: {
      websites: ['https://zksync.io/', 'https://zksync.dappradar.com/'],
      bridges: ['https://portal.zksync.io/bridge/'],
      documentation: ['https://docs.zksync.io/'],
      explorers: [
        'https://explorer.zksync.io/',
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
      other: [
        'https://rollup.codes/zksync-era',
        'https://growthepie.com/chains/zksync-era',
      ],
    },
  },
  interopConfig: {
    durationSplit: {
      lockAndMint: {
        in: {
          label: 'L1 -> L2',
          from: 'ethereum',
          to: 'zksync2',
        },
        out: {
          label: 'L2 -> L1',
          from: 'zksync2',
          to: 'ethereum',
        },
      },
    },
    plugins: [
      {
        plugin: 'zkstack',
        chain: 'zksync2',
      },
    ],
  },
  chainConfig: {
    name: 'zksync2',
    chainId,
    explorerUrl: 'https://explorer.zksync.io',
    sinceTimestamp: UnixTime(1676384520),
    multicallContracts: [
      {
        version: '3',
        address: EthereumAddress('0xF9cda624FBC7e059355ce98a31693d299FACd963'),
        batchSize: 150,
        sinceBlock: 3908235,
      },
    ],
    coingeckoPlatform: 'zksync',
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.era.zksync.io',
        callsPerMinute: 300,
      },
      {
        type: 'etherscan',
        chainId,
        customUrl: 'https://block-explorer-api.mainnet.zksync.io/api',
      },
    ],
  },
  associatedTokens: ['ZK'],
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  // validatorTimelockOnGateway: discovery.getContract('ZKsyncValidatorTimelock'),
  nonTemplateDaTracking: [
    {
      // tracks old Era DA on ethereum
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 21809364,
      untilBlock: 23016895, // migration to Gateway
      inbox: 'eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564',
      sequencers: [
        '0xE1D8d4C8656949764c2c9Fa9faB2C15d3F42e6C2',
        '0x30066439887C0a509Cb38E45c9262E6924a29BbD',
      ],
    },
    // tracking the gateway DA since only Era is on the gateway for now
    // and Era data is relayed by the gateway validators
    // TODO: differentiate others that move to gateway DA from zksync
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 23016895, // migration to Gateway
      untilBlock: 23633924, // v29 upgrade
      inbox: 'eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564',
      sequencers: [
        '0x14F19299476664665eDa17DBb7dA7e62E3253aa8',
        '0x7d95f0B9D3383D58E39a75a67760aA2153D355A2',
      ],
    },
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 23633924,
      inbox: 'eth:0x2e5110cF18678Ec99818bFAa849B8C881744b776',
      sequencers: [
        '0x14F19299476664665eDa17DBb7dA7e62E3253aa8',
        '0x7d95f0B9D3383D58E39a75a67760aA2153D355A2',
      ],
    },
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
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
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x41527B2d03844dB6b0945f25702cB958b6d55989',
      ),
      sinceTimestamp: UnixTime(1698058151),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Bridge for depositing wrapped stETH (Lido) to ZKsync Era. These deposits and withdrawals do not go through the new shared BridgeHub.',
      upgradableBy: [{ name: 'Lido (Lido Agent)', delay: 'no' }],
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x32400084C286CF3E17e7B677ea9583e60a000324',
      ),
      sinceTimestamp: UnixTime(1676268575),
      tokens: ['ETH'],
      description: 'Main rollup contract of ZKsync Era.',
      isHistorical: true,
      untilTimestamp: UnixTime(1717922458),
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063',
      ),
      sinceTimestamp: UnixTime(1676367083),
      tokens: '*',
      description:
        'Legacy bridge for depositing ERC20 tokens to ZKsync Era. Forwards deposits and withdrawals to the BridgeHub.',
    }),
  ],
  usesEthereumBlobs: true,
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9',
        ), // gateway diamond on ethereum
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x0b6db820',
        functionSignature:
          'function precommitSharedBridge(address _chainAddress, uint256, bytes)',
        sinceTimestamp: UnixTime(1761146555),
        untilTimestamp: l1migrationTs,
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0x32400084C286CF3E17e7B677ea9583e60a000324',
        ),
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x0b6db820',
        functionSignature:
          'function precommitSharedBridge(address _chainAddress, uint256, bytes)',
        sinceTimestamp: l1migrationTs,
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xa0425d71cB1D6fb80E65a5361a04096E0672De03'),
        selector: '0x701f58c5',
        functionSignature:
          'function commitBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32), (uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])',
        sinceTimestamp: UnixTime(1701721931),
        untilTimestamp: UnixTime(1710169104),
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
        sinceTimestamp: UnixTime(1710169104),
        untilTimestamp: UnixTime(1717681823),
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
        sinceTimestamp: UnixTime(1717681823),
        untilTimestamp: UnixTime(1722410363), // first cronoszkevm batch commit to the shared ValidatorTimelock https://etherscan.io/tx/0x9c69ea744cdfa74e328234f546b4313dab448d2126a2a1c4dda706f9d233c3a5
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: 324,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6edd4f12',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _lastCommittedBatchData, (uint64 batchNumber, uint64 timestamp, uint64 indexRepeatedStorageChanges, bytes32 newStateRoot, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 bootloaderHeapInitialContentsHash, bytes32 eventsQueueStateHash, bytes systemLogs, bytes pubdataCommitments)[] _newBatchesData)',
        sinceTimestamp: UnixTime(1722410363),
        untilTimestamp: UnixTime(1741792103),
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: 324,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0x98f81962',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: UnixTime(1741792103),
        untilTimestamp: UnixTime(1753696643),
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: 9075,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0x98f81962',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: UnixTime(1753696643),
        untilTimestamp: UnixTime(1761146555),
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9',
        ), // gateway diamond on ethereum
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x0db9eb87',
        functionSignature:
          'function commitBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: UnixTime(1761146555),
        untilTimestamp: l1migrationTs,
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0x32400084C286CF3E17e7B677ea9583e60a000324',
        ),
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x0db9eb87',
        functionSignature:
          'function commitBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: l1migrationTs,
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
        sinceTimestamp: UnixTime(1679602559),
        untilTimestamp: UnixTime(1701718427),
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
        sinceTimestamp: UnixTime(1701258299),
        untilTimestamp: UnixTime(1710165419),
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
        sinceTimestamp: UnixTime(1710165419),
        untilTimestamp: UnixTime(1717694375),
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
        sinceTimestamp: UnixTime(1717694375),
        untilTimestamp: UnixTime(1722410363),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: 324,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0xc37533bb',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId,(uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment) _prevBatch, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _committedBatches, (uint256[] recursiveAggregationInput, uint256[] serializedProof) _proof)',
        sinceTimestamp: UnixTime(1722410363),
        untilTimestamp: UnixTime(1741792103),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: 324,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xe12a6137',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId, uint256, uint256, bytes)',
        sinceTimestamp: UnixTime(1741792103),
        untilTimestamp: UnixTime(1753696643),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: 9075,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xe12a6137',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId, uint256, uint256, bytes)',
        sinceTimestamp: UnixTime(1753696643),
        untilTimestamp: UnixTime(1761146555),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9',
        ), // gateway diamond on ethereum
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x9271e450',
        functionSignature:
          'function proveBatchesSharedBridge(address _chainAddress, uint256, uint256, bytes)',
        sinceTimestamp: UnixTime(1761146555),
        untilTimestamp: l1migrationTs,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0x32400084C286CF3E17e7B677ea9583e60a000324',
        ),
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x9271e450',
        functionSignature:
          'function proveBatchesSharedBridge(address _chainAddress, uint256, uint256, bytes)',
        sinceTimestamp: l1migrationTs,
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
        sinceTimestamp: UnixTime(1679602559),
        untilTimestamp: UnixTime(1701719687),
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
        sinceTimestamp: UnixTime(1701258299),
        untilTimestamp: UnixTime(1710167255),
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
        sinceTimestamp: UnixTime(1710167255),
        untilTimestamp: UnixTime(1717683407),
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
        sinceTimestamp: UnixTime(1717683407),
        untilTimestamp: UnixTime(1722410363),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: 324,
        address: EthereumAddress('0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E'),
        selector: '0x6f497ac6',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[] _batchesData)',
        sinceTimestamp: UnixTime(1722410363),
        untilTimestamp: UnixTime(1741792103),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: 324,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xcf02827d',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: UnixTime(1741792103),
        untilTimestamp: UnixTime(1753696643),
      },
    },
    // tracking the gateway txs since only Era is on the gateway for now
    // TODO: differentiate others that move to gateway settlement from zksync
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: 9075,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xcf02827d',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: UnixTime(1753696643),
        untilTimestamp: UnixTime(1761146555),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9',
        ), // gateway diamond on ethereum
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0xa085344d',
        functionSignature:
          'function executeBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: UnixTime(1761146555),
        untilTimestamp: l1migrationTs,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0x32400084C286CF3E17e7B677ea9583e60a000324',
        ),
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0xa085344d',
        functionSignature:
          'function executeBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: l1migrationTs,
      },
    },
  ],
  milestones: [
    {
      title: 'V29 Interop Messaging Upgrade',
      url: 'https://www.tally.xyz/gov/zksync/proposal/40562439712311128665286075271414168289029475306445402072499591795343687723101?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f',
      date: '2025-10-06T00:00:00Z',
      description:
        'A protocol upgrade introducing native interop messaging between chains connected to ZKsync Gateway.',
      type: 'general',
    },
    {
      title: 'Proof system intervention',
      url: 'https://x.com/zksync/status/1951434107575214429',
      date: '2025-07-30T00:00:00Z',
      description:
        'The proof system is manually paused due to a vulnerability, causing a partial liveness failure.',
      type: 'incident',
    },
    {
      title: 'Gateway Migration',
      url: 'https://x.com/zksync/status/1950502172384547245',
      date: '2025-07-28T00:00:00Z',
      description:
        "ZKsync Era is the first chain migrating to the 'Gateway' settlement layer.",
      type: 'general',
    },
    {
      title: 'V28 Precompile Upgrade',
      url: 'https://www.tally.xyz/gov/zksync/proposal/54063168049426383294336598998322383147338444177076559098597792110160570100155?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f',
      date: '2025-05-29T00:00:00Z',
      description:
        'A performance upgrade enabling circuit-backed cryptographic precompiles.',
      type: 'general',
    },
    {
      title: 'V27 EVM Emulation Upgrade',
      url: 'https://www.tally.xyz/gov/zksync/proposal/112142012854508751423955156601121618924383324119199970784935099214632480260394?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f',
      date: '2025-04-18T00:00:00Z',
      description:
        'This implementation adds 2 features: EVM emulation and Fflonk verifier.',
      type: 'general',
    },
    {
      title: 'ZK token minter key compromised',
      url: 'https://zksync.mirror.xyz/W5vPDZqEqf2NuwQ5x7SyFnIxqqpE1szAFD69iaaBFnI',
      date: '2025-04-13T00:00:00Z',
      description:
        '1/1 signer key of a ZK airdrop admin multisig is compromised. ZKsync deploys TransactionFilterer.',
      type: 'incident',
    },
    {
      title: 'ZKsync Protocol Upgrade v26',
      url: 'https://www.tally.xyz/gov/zksync/proposal/67712324710515983914473127418805437707715095849437613773846173900686148862581?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f',
      date: '2025-02-27T00:00:00Z',
      description:
        'A foundational upgrade enabling custom settlement layers, custom DA, and new asset routing.',
      type: 'general',
    },
    {
      title: 'ZKsync Protocol Upgrade v25',
      url: 'https://www.tally.xyz/gov/zksync/proposal/39897055470405054808751466940888279812739313934036970931300785151980460250983?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f',
      date: '2024-12-27T00:00:00Z',
      description:
        'A protocol hardening upgrade improving code quality, gas efficiency, and internal stability.',
      type: 'general',
    },
    {
      title: 'Onchain Governance Launch',
      url: 'https://blog.zknation.io/zksync-governance-system/',
      date: '2024-09-12T00:00:00Z',
      description:
        'An onchain Governance system is introduced, including a Security Council and Guardians.',
      type: 'general',
    },
    {
      title: 'ZKsync Protocol Upgrade v24',
      url: 'https://github.com/ZKsync-Community-Hub/zksync-developers/discussions/519',
      date: '2024-06-06T00:00:00Z',
      description:
        'A protocol upgrade that introduces a shared bridge and the foundation for other ZK stack chains.',
      type: 'general',
    },
    {
      title: 'ZKsync Era starts using blobs',
      url: 'https://twitter.com/zksync/status/1767983026443579448',
      date: '2024-03-13T00:00:00Z',
      description: 'ZKsync Era starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Introduction of Boojum prover',
      url: 'https://zksync.mirror.xyz/HJ2Pj45EJkRdt5Pau-ZXwkV2ctPx8qFL19STM5jdYhc',
      date: '2023-07-17T00:00:00Z',
      description: 'Deployment of Boojum - new high-performance proof system.',
      type: 'general',
    },
    {
      title: 'ZKsync 2.0 baby alpha launch',
      url: 'https://blog.matter-labs.io/baby-alpha-has-arrived-5b10798bc623',
      date: '2022-10-28T00:00:00Z',
      description: 'ZKsync 2.0 baby alpha is launched on mainnet.',
      type: 'general',
    },
    {
      title: 'Fair Onboarding Alpha and Rebranding',
      url: 'https://blog.matter-labs.io/all-aboard-zksync-era-mainnet-8b8964ba7c59',
      date: '2023-02-16T00:00:00Z',
      description:
        'ZKsync 2.0 rebrands to ZKsync Era and lets registered projects and developers deploy on mainnet.',
      type: 'general',
    },
    {
      title: 'Full Launch Alpha',
      url: 'https://blog.matter-labs.io/gm-zkevm-171b12a26b36',
      date: '2023-03-24T00:00:00Z',
      description: 'ZKsync Era is now permissionless and open for everyone.',
      type: 'general',
    },
  ],
})
