import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('swan')

export const swan: Layer2 = opStackL2({
  createdAt: new UnixTime(1722275591), // 2024-07-29T17:53:11Z
  discovery,
  additionalBadges: [Badge.Infra.Superchain],
  additionalPurposes: ['AI', 'Storage'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Swan Chain',
    slug: 'swan',
    description:
      'Swan Chain is an OP Stack L2 providing comprehensive AI infrastructure on the blockchain.',
    links: {
      websites: ['https://swanchain.io/'],
      apps: ['https://bridge.swanchain.io/'],
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
  genesisTimestamp: new UnixTime(1718640220),
  // failing, needs different analyzer?
  // finality: {
  //   type: 'OPStack-blob',
  //   genesisTimestamp: new UnixTime(1718640220),
  //   minTimestamp: new UnixTime(1718683727), // first blob
  //   l2BlockTimeSeconds: 2,
  //   lag: 0,
  //   stateUpdate: 'disabled',
  // },
  isNodeAvailable: true,
  rpcUrl: 'https://mainnet-rpc01.swanchain.io',
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://swanchain.medium.com/announcement-swan-chain-mainnet-is-now-live-e34feadec170',
      date: '2024-07-02T00:00:00Z',
      description: 'Swan Mainnet launches.',
      type: 'general',
    },
  ],
})
