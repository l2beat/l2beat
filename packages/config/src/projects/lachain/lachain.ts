import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const genesisTimestamp = UnixTime(1744840800) // 2025-04-16T17:00:00Z
const chainId = 2904
const discovery = new ProjectDiscovery('lachain')

export const lachain: ScalingProject = zkStackL2({
  addedAt: UnixTime(1740072754), // 2025-01-20T17:32:34Z
  display: {
    name: 'LaChain',
    slug: 'lachain',
    description:
      "LaChain, Ripio's blockchain, is designed for the Latin American ecosystem. Scalable, secure, and part of the Elastic Chain by ZKsync.",
    links: {
      websites: ['https://lachain.network'],
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
      {
        type: 'zksync',
        url: 'https://api-explorer.zk.lachain.network/api',
        callsPerMinute: 1500,
      },
    ],
  },
  discovery,
  diamondContract: discovery.getContract(''), // TODO
  usesEthereumBlobs: true,
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
