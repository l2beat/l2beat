import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const genesisTimestamp = UnixTime(1741634331) // 2025-03-10T19:18:51Z
const chainId = 9637
const discovery = new ProjectDiscovery('wonder')

export const wonder: ScalingProject = zkStackL2({
  addedAt: UnixTime(1740073109), // 2025-01-20T17:38:29Z
  display: {
    name: 'Wonder',
    slug: 'wonder',
    description:
      "Wonder provides access to DeFi through ZKsync's Ethereum-level security, with scalability and cost-efficiency.",
    links: {
      websites: ['https://www.wonderchain.org'],
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
      {
        type: 'zksync',
        url: 'https://block-explorer.mainnet.wonderchain.org/api',
        callsPerMinute: 1500,
      },
    ],
  },
  discovery,
  diamondContract: discovery.getContract(''), // TODO
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
