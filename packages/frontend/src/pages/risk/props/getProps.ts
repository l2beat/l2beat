import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { formatUSD, getPercentageChange } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { RiskPageProps } from '../view/RiskPage'
import { getPageMetadata } from './getPageMetadata'
import { getRiskView } from './getRiskView'

export function getProps(
  projects: Project[],
  apiMain: ApiMain,
): Wrapped<RiskPageProps> {
  const tvl = apiMain.charts.hourly.data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = apiMain.charts.hourly.data[0]?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const getTvl = (project: Project) =>
    apiMain.projects[project.id.toString()]?.charts.hourly.data.at(-1)?.[1] ?? 0
  const ordering = [...projects].sort((a, b) => getTvl(b) - getTvl(a))

  return {
    props: {
      tvl: formatUSD(tvl),
      sevenDayChange,
      apiEndpoint: '/api/tvl.json',
      riskView: getRiskView(ordering),
    },
    wrapper: {
      preloadApi: '/api/tvl.json',
      metadata: getPageMetadata(),
    },
  }
}
