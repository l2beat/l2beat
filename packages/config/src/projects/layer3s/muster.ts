import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('muster', 'arbitrum')

export const muster: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1718609683), // 2024-06-17T07:34:43Z
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.AltLayer],
  hostChain: ProjectId('arbitrum'),
  additionalPurposes: ['Gaming'],
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
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://muster.alt.technology',
  discovery,
  discoveryDrivenData: true,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
