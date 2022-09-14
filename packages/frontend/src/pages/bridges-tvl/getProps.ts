import { Bridge } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { Wrapped } from '../Page'
import { BridgesTvlPageProps } from './BridgesTvlPage'
import { BridgesTvlViewEntry } from './BridgesTvlView'

export function getProps(
  bridges: Bridge[],
  apiMain: ApiMain,
): Wrapped<BridgesTvlPageProps> {
  return {
    props: {
      items: bridges.map(
        (bridge): BridgesTvlViewEntry => ({
          name: bridge.name,
          type: bridge.type,
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
