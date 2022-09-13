import { Bridge } from '@l2beat/config'

import { Wrapped } from '../Page'
import { BridgesRiskPageProps } from './BridgesRiskPage'

export function getProps(bridges: Bridge[]): Wrapped<BridgesRiskPageProps> {
  return {
    props: {
      items: bridges.map((bridge) => ({
        name: bridge.name,
        validation: bridge.validation,
        type: bridge.type,
        destination: bridge.destination,
        ...bridge.risks,
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
