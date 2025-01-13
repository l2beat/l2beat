import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { AnytrustDAC } from '../other/da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('oevnetwork')

export const oev: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1707313169), // 2024-02-07T13:39:29Z
  additionalPurposes: ['Oracles'],
  additionalBadges: [Badge.RaaS.Caldera, Badge.DA.DAC],
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
      REASON_FOR_BEING_OTHER.SMALL_DAC,
    ],
    name: 'OEV Network',
    slug: 'oev',
    description:
      'OEV is an Orbit stack Optimium by API3, designed to capture oracle extractable value and return it to the dApps and users that generated it.',
    links: {
      websites: ['https://api3.org/oev/'],
      apps: ['https://oev.bridge.api3.org/'],
      documentation: [
        'https://docs.api3.org/reference/oev-network/',
        'https://medium.com/api3/api3-builds-oev-network-on-arbitrum-orbit-b29f8f5d7dcf',
      ],
      explorers: ['https://oev.explorer.api3.org/'],
      repositories: ['https://github.com/API3DAO'],
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
  discoveryDrivenData: true,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  dataAvailabilitySolution: AnytrustDAC({
    bridge: {
      createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    },
    discovery,
  }),
})
