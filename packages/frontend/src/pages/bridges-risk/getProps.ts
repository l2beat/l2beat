import { BridgeDescription } from '@l2beat/config'

import { Wrapped } from '../Page'
import { BridgesRiskPageProps } from './BridgesRiskPage'

export function getProps(
  bridges: BridgeDescription[],
): Wrapped<BridgesRiskPageProps> {
  return {
    props: {
      items: bridges.map((bridge) => ({
        name: bridge.name,
        sourceOwnership: bridge.risks?.sourceOwnership.description ?? '-',
        sourceUpgradeability:
          bridge.risks?.sourceUpgradeability.description ?? '-',
        destinationOwnership:
          bridge.risks?.destinationOwnership.description ?? '-',
        destinationUpgradeability:
          bridge.risks?.destinationUpgradeability.description ?? '-',
      })),
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
