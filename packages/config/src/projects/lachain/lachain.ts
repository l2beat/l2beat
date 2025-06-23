import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('lachain')
const chainId = 2904
const genesisTimestamp = UnixTime(1744817872) // 2025-04-16T17:00:00Z

export const lachain: ScalingProject = zkStackL2({
  addedAt: UnixTime(1740072754), // 2025-01-20T17:32:34Z
  display: {
    name: 'LaChain',
    slug: 'lachain',
    description:
      'LaChain by Ripio is a general purpose ZK rollup designed for the Latin American ecosystem. Scalable, secure, and part of the Elastic Chain by ZKsync.',
    links: {
      websites: ['https://lachain.network'],
      bridges: ['https://bridge.zk.lachain.network/'],
      documentation: ['https://lachain.gitbook.io/lachain-docs'],
      explorers: ['https://explorer.zk.lachain.network'],
      socialMedia: ['https://x.com/LaChain_Network'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  chainConfig: {
    name: 'lachain',
    chainId,
    explorerUrl: 'https://explorer.zk.lachain.network',
    sinceTimestamp: genesisTimestamp,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc1.zk.lachain.network',
        callsPerMinute: 1500,
      },
    ],
  },
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0x98f81962',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
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
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xe12a6137',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId, uint256, uint256, bytes)',
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
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xcf02827d',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
  discovery,
  diamondContract: discovery.getContract('zkVmDiamond'),
  usesEthereumBlobs: true,
  // gas token LAC not on coingecko, no significant other TVS or activity
  // nonTemplateEscrows: [
  //     discovery.getEscrowDetails({
  //       address: bridge.address,
  //       tokens: ['LAC'],
  //       description:
  //         'Shared bridge for depositing tokens to LaChain and other ZK stack chains.',
  //       sharedEscrow: {
  //         type: 'ElasticChain',
  //         l2BridgeAddress: EthereumAddress(
  //           '0x0000000000000000000000000000000000010003', // l2 asset handler!! (bridge is deprecated in new zk stack chains)
  //         ),
  //         l2EtherAddress: EthereumAddress(
  //           '0x67839604E5e3EFA4526267F791c951708B53419C', // no ether bridged yet
  //         ),
  //         tokensToAssignFromL1: ['LAC'],
  //       },
  //     }),
  //   ],
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/LaChain_Network/status/1924843567526068604',
      date: '2025-05-20T00:00:00Z',
      description: 'LaChain is live on mainnet.',
      type: 'general',
    },
  ],
})
