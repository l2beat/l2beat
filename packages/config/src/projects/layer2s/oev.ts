import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('oev')

export const alienx: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1719847684), // 2024-07-01T15:28:04Z
  badges: [Badge.RaaS.Caldera, Badge.DA.DAC],
  display: {
    name: 'OEV Network',
    slug: 'oev',
    description:
      'OEV is an Optimium by API3, built with the Arbitrum Orbit stack. It is designed to capture oracle extractable value and return it to the dApps and their users that generated it.',
      links: {
        websites: ['https://api3.org/oev/'],
        apps: [],
        documentation: [
          'https://medium.com/api3/api3-builds-oev-network-on-arbitrum-orbit-b29f8f5d7dcf',
        ],
        explorers: [],
        repositories: [],
        socialMedia: [
          'https://x.com/OEVNetwork',
          'https://discord.com/invite/api3dao',
          'https://medium.com/api3',
        ],
      },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://oev.rpc.api3.org/http',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
