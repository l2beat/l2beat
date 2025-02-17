import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('muster', 'arbitrum')

export const muster: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1718609683), // 2024-06-17T07:34:43Z
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.AltLayer],
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
    category: 'Optimium',
    description:
      'Muster Network is an Arbitrum Orbit L3 gaming chain aiming to transform digital ownership for brands and games while managing blockchain infrastructure and security.',
    links: {
      websites: ['https://cometh.io/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=muster&sourceChain=arbitrum-one',
      ],
      documentation: ['https://docs.cometh.io/marketplace'],
      explorers: ['https://muster-explorer.alt.technology/'],
      repositories: ['https://github.com/cometh-hq'],
      socialMedia: ['https://x.com/Cometh', 'https://blog.cometh.io/'],
    },
  },
  rpcUrl: 'https://muster.alt.technology',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery }),
})
