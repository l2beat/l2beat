import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('oevnetwork')

export const oevnetwork: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1707313169), // 2024-02-07T13:39:29Z
  additionalPurposes: ['Oracles'],
  additionalBadges: [BADGES.RaaS.Caldera],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'OEV Network',
    slug: 'oev',
    description:
      'OEV is an Orbit stack Optimium by API3, designed to capture oracle extractable value and return it to the dApps and users that generated it.',
    links: {
      websites: ['https://api3.org/'],
      bridges: ['https://oev.bridge.api3.org/'],
      documentation: [
        'https://docs.api3.org/oev-searchers/',
        'https://medium.com/api3/api3-builds-oev-network-on-arbitrum-orbit-b29f8f5d7dcf',
      ],
      explorers: ['https://oev.explorer.api3.org/'],
      repositories: ['https://github.com/API3DAO'],
      socialMedia: [
        'https://discord.com/invite/api3dao',
        'https://medium.com/api3',
      ],
    },
  },
  chainConfig: {
    name: 'oevnetwork',
    chainId: 4913,
    apis: [
      {
        type: 'rpc',
        url: 'https://oev.rpc.api3.org/http',
        callsPerMinute: 300,
      },
    ],
  },
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
})
