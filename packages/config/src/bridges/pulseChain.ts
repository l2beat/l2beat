import { ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('pulseChain')

export const pulseChain: Bridge = {
  type: 'bridge',
  id: ProjectId('pulseChain'),
  display: {
    name: 'PulseChain',
    slug: 'pulsechain',
    description: '',
    links: {
      websites: ['https://pulsechain.com/'],
    },
  },
  config: {
    escrows: [
      // not using discovery.getEscrowDetails as we do not support the proxy here yet.
      {
        address: discovery.getAddressFromValue(
          'WETHOmnibridgeRouter',
          'bridge',
        ),
        sinceTimestamp: new UnixTime(1684137600),
        tokens: '*',
      },
    ],
  },
  technology: {
    // not sure about this
    category: 'Token Bridge',
    destination: ['PulseChain'],
  },
  riskView: {},
}
