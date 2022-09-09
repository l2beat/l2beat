import { Layer2 } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { formatUSD, getPercentageChange } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { TvlPageProps } from '../view/TvlPage'
import { getFinancialView } from './getFinancialView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  projects: Layer2[],
  apiMain: ApiMain,
): Wrapped<TvlPageProps> {
  const tvl = apiMain.charts.hourly.data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = apiMain.charts.hourly.data[0]?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const getTvl = (project: Layer2) =>
    apiMain.projects[project.id.toString()]?.charts.hourly.data.at(-1)?.[1] ?? 0
  const ordering = [...projects].sort((a, b) => getTvl(b) - getTvl(a))

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
