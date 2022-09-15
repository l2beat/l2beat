import { Layer2 } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { orderByTvl } from '../../../utils/orderByTvl'
import { formatUSD, getPercentageChange } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { TvlPageProps } from '../view/TvlPage'
import { getFinancialView } from './getFinancialView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  projects: Layer2[],
  apiMain: ApiMain,
): Wrapped<TvlPageProps> {
  const tvl = apiMain.layers2s.hourly.data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = apiMain.layers2s.hourly.data[0]?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const ordering = orderByTvl(projects, apiMain)

  return {
    props: {
      tvl: formatUSD(tvl),
      sevenDayChange,
      apiEndpoint: '/api/tvl.json',
      financialView: getFinancialView(ordering, apiMain, tvl),
    },
    wrapper: {
      preloadApi: '/api/tvl.json',
      metadata: getPageMetadata(),
    },
  }
}
