import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('swan')

export const swan: ScalingProject = opStackL2({
  addedAt: UnixTime(1722275591), // 2024-07-29T17:53:11Z
  discovery,
  additionalPurposes: ['AI', 'Storage'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Swan Chain',
    slug: 'swan',
    description:
      'Swan Chain is an OP Stack L2 providing comprehensive AI infrastructure on the blockchain.',
    links: {
      websites: ['https://swanchain.io/'],
      bridges: ['https://bridge.swanchain.io/'],
      documentation: ['https://docs.swanchain.io/'],
      explorers: [
        'https://mainnet-explorer.swanchain.io/',
        'https://swanscan.io/',
      ],
      repositories: ['https://github.com/swanchain'],
      socialMedia: [
        'https://x.com/swan_chain',
        // 'https://t.me/swan_chain/', fails tests
        'https://discord.gg/swanchain',
        'https://linkedin.com/company/swancloud',
        'https://swanchain.medium.com/',
      ],
    },
  },
  genesisTimestamp: UnixTime(1718640220),
  isNodeAvailable: true,
  chainConfig: {
    name: 'swan',
    chainId: 254,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet-rpc-01.swanchain.org',
        callsPerMinute: 1500,
      },
    ],
  },
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://swanchain.medium.com/announcement-swan-chain-mainnet-is-now-live-e34feadec170',
      date: '2024-07-02T00:00:00Z',
      description: 'Swan Mainnet launches.',
      type: 'general',
    },
  ],
})
