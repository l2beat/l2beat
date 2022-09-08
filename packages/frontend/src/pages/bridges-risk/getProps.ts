import { BridgeDescription } from '@l2beat/config'

import { Wrapped } from '../Page'
import { BridgesRiskPageProps } from './BridgesRiskPage'

export function getProps(
  bridges: BridgeDescription[],
): Wrapped<BridgesRiskPageProps> {
  return {
    props: {
      items: bridges.map((bridge) => ({ name: bridge.name, ...bridge.risks })),
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
