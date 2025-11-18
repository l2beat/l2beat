import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const genesisTimestamp = UnixTime(1744071776) // 2025-04-07T19:22:56Z
const chainId = 1217
const discovery = new ProjectDiscovery('sxt')

export const sxt: ScalingProject = zkStackL2({
  addedAt: UnixTime(1716819511), // 2024-05-27T14:18:31Z
  additionalBadges: [BADGES.RaaS.Caldera],
  display: {
    name: 'Space and Time',
    slug: 'sxt',
    description:
      "Space and Time (SxT) is a decentralized data warehouse that aims to provide a zk 'Proof of SQL' to bring offchain data to smart contracts onchain. Built on ZK Stack, the SxT chain will serve as a settlement layer and payment hub for data queries.",
    links: {
      websites: ['https://spaceandtime.io'],
      bridges: ['https://app.spaceandtime.ai'],
      documentation: ['https://docs.spaceandtime.io'],
      explorers: ['https://spaceandtime.calderaexplorer.xyz'],
      repositories: ['https://github.com/spaceandtimelabs'],
      socialMedia: [
        'https://x.com/SpaceandTimeDB',
        'https://discord.com/invite/spaceandtimeDB',
        'https://linkedin.com/company/space-and-time-db/',
        'https://youtube.com/channel/UCXJyE7ahmqCH11aO7L76PBA',
        'https://t.me/spaceandtimedb',
        'https://instagram.com/spaceandtimedb/',
        'https://spaceandtime.io/blog',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
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
        firstParameter: chainId,
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
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xcf02827d',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
  chainConfig: {
    name: 'sxt',
    chainId,
    explorerUrl: 'https://spaceandtime.calderaexplorer.xyz',
    sinceTimestamp: genesisTimestamp,
    apis: [
      {
        type: 'rpc',
        url: 'https://spaceandtime.calderachain.xyz/http',
        callsPerMinute: 300,
      },
    ],
  },
  discovery,
  diamondContract: discovery.getContract('zkVmDiamond'),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/SpaceandTimeDB/status/1920873080471384271',
      date: '2025-05-09T00:00:00Z',
      description: 'Space and Time is live on mainnet.',
      type: 'general',
    },
  ],
})
