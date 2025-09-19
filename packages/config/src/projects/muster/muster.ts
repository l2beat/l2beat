import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('muster')

export const muster: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1718609683), // 2024-06-17T07:34:43Z
  additionalBadges: [BADGES.RaaS.AltLayer],
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Muster',
    slug: 'muster',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      'Muster Network is an Arbitrum Orbit L3 gaming chain aiming to transform digital ownership for brands and games while managing blockchain infrastructure and security.',
    links: {
      websites: ['https://cometh.io/'],
      bridges: [
        'https://bridge.arbitrum.io/?destinationChain=muster&sourceChain=arbitrum-one',
      ],
      documentation: ['https://docs.cometh.io'],
      explorers: ['https://muster-explorer.alt.technology/'],
      repositories: ['https://github.com/cometh-hq'],
      socialMedia: [
        'https://x.com/Cometh',
        'https://blog.cometh.io/',
        'https://linkedin.com/company/comethstudio',
        'https://youtube.com/@comethio',
      ],
    },
  },
  chainConfig: {
    name: 'muster',
    chainId: 4078,
    apis: [
      {
        type: 'rpc',
        url: 'https://muster.alt.technology',
        callsPerMinute: 300,
      },
    ],
  },
  hostChain: 'arbitrum',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
})
