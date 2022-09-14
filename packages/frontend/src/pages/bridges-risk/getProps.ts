import { Bridge } from '@l2beat/config'

import { Wrapped } from '../Page'
import { BridgesRiskPageProps } from './BridgesRiskPage'
import { BridgesRiskViewEntry } from './BridgesRiskView'

export function getProps(bridges: Bridge[]): Wrapped<BridgesRiskPageProps> {
  return {
    props: {
      items: bridges.map(
        (bridge): BridgesRiskViewEntry => ({
          name: bridge.name,
          validation: bridge.validation,
          type: bridge.type,
          destination: bridge.destination,
          sourceUpgradeability: bridge.risks?.sourceUpgradeability,
          destinationToken: bridge.risks?.destinationToken,
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
