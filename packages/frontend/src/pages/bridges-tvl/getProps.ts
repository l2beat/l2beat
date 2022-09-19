import { Bridge } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { orderByTvl } from '../../utils/orderByTvl'
import { Wrapped } from '../Page'
import { BridgesTvlPageProps } from './BridgesTvlPage'
import { BridgesTvlViewEntry } from './BridgesTvlView'

export function getProps(
  bridges: Bridge[],
  apiMain: ApiMain,
): Wrapped<BridgesTvlPageProps> {
  const ordering = orderByTvl(bridges, apiMain)
  return {
    props: {
      items: ordering.map(
        (bridge): BridgesTvlViewEntry => ({
          name: bridge.name,
          type: bridge.type,
          tvl:
            apiMain.projects[bridge.id.toString()]?.charts.hourly.data.at(
              -1,
            )?.[1] ?? 0,
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
