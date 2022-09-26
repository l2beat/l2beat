import { Bridge } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { orderByTvl } from '../../../utils/orderByTvl'
import { Wrapped } from '../../Page'
import { BridgesTvlPageProps } from '../BridgesTvlPage'
import { getBridgesTvlView } from './getFinancialView'

export function getProps(
  bridges: Bridge[],
  apiMain: ApiMain,
): Wrapped<BridgesTvlPageProps> {
  const ordering = orderByTvl(bridges, apiMain)
  const tvl = apiMain.bridges.hourly.data.at(-1)?.[1] ?? 0
  return {
    props: {
      items: getBridgesTvlView(ordering, apiMain, tvl),
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
