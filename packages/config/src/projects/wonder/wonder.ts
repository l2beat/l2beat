import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const genesisTimestamp = UnixTime(1741634331) // 2025-03-10T19:18:51Z
const chainId = 9637
const discovery = new ProjectDiscovery('wonder')
const bridge = discovery.getContract('L1NativeTokenVault')

export const wonder: ScalingProject = zkStackL2({
  addedAt: UnixTime(1741634331), // 2025/03/10 19:18 UTC
  display: {
    name: 'Wonder',
    slug: 'wonder',
    description:
      "Wonder provides access to DeFi through ZKsync's Ethereum-level security, with scalability and cost-efficiency.",
    links: {
      websites: ['https://wonderchain.org'],
      apps: ['https://wonderchain.org/bridge/'],
      documentation: ['https://docs.wonderchain.org'],
      explorers: ['https://explorer.mainnet.wonderchain.org'],
      socialMedia: ['https://x.com/WonderFiLabs'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  chainConfig: {
    name: 'wonder',
    chainId,
    explorerUrl: 'https://explorer.mainnet.wonderchain.org',
    sinceTimestamp: genesisTimestamp,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mainnet.wonderchain.org',
        callsPerMinute: 1500,
      },
    ],
  },
  discovery,
  diamondContract: discovery.getContract('zkVmDiamond'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['ETH', 'USDC'],
      description:
        'Shared bridge for depositing tokens to ZERϴ and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0xFb07A45D72DBE6E09Fd07eA4A22BAB4f85295C27',
        ),
        l2EtherAddress: EthereumAddress(
          '0x000000000000000000000000000000000000800A',
        ),
      },
    }),
  ],
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
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/WonderFiLabs/status/1922684100231491705',
      date: '2025-05-09T00:00:00Z',
      description: 'Wonder Chain is live on mainnet.',
      type: 'general',
    },
  ],
})
