import { Bridge, Layer2RiskViewEntry } from '@l2beat/config'

import { Wrapped } from '../Page'
import { BridgesRiskPageProps } from './BridgesRiskPage'
import { BridgesRiskViewEntry } from './BridgesRiskView'

export function getProps(bridges: Bridge[]): Wrapped<BridgesRiskPageProps> {
  return {
    props: {
      items: bridges.map(
        (bridge): BridgesRiskViewEntry => ({
          name: bridge.name,
          type: bridge.type,
          destination: getDestination(bridge.destination),
          ...bridge.risks,
        }),
      ),
    },
    wrapper: {
      metadata: {
        description: '',
        image: '',
        title: '',
        url: '',
      },
    },
  }
}

function getDestination(destinations: string[]): Layer2RiskViewEntry {
  if (destinations.length === 0) {
    throw new Error('Invalid destination')
  }
  if (destinations.length === 1) {
    return { value: destinations[0], description: '' }
  }
  if (destinations.length === 2) {
    return { value: destinations.join(', '), description: '' }
  }
  return { value: 'Multichain', description: destinations.join(', ') }
}
