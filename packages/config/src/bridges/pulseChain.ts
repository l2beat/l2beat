import { ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Bridge } from './types'
import { RISK_VIEW } from './common'

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
      discovery.getEscrowDetails({
        identifier: 'ForeignOmnibridge',
        sinceTimestamp: new UnixTime(1684137600),
        tokens: '*',
      }),
    ],
  },
  technology: {
    // not sure about this
    category: 'Token Bridge',
    destination: ['PulseChain'],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be signed offchain by a designed list of Validators.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'The code that secures the system can be changed arbitrarily and without notice.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.WRAPPED,
  },
}
