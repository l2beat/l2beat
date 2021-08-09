import { Project } from '@l2beat/config'
import { L2Data } from '../../../L2Data'
import { formatUSD, getFromEnd, getPercentageChange } from '../../../utils'
import { HomePageProps } from '../view/HomePage'
import { getFinancialView } from './getFinancialView'
import { getPageMetadata } from './getPageMetadata'
import { getRiskView } from './getRiskView'

export function getHomePage(
  projects: Project[],
  l2Data: L2Data
): HomePageProps {
  const tvl = getFromEnd(l2Data.aggregate.data, 0)[1]
  const tvlSevenDaysAgo = getFromEnd(l2Data.aggregate.data, 7)[1]
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const getTvl = (project: Project) =>
    getFromEnd(l2Data.byProject[project.name].aggregate.data, 0)[1]
  const ordering = [...projects].sort((a, b) => getTvl(b) - getTvl(a))

  return {
    tvl: formatUSD(tvl),
    sevenDayChange,
    apiEndpoint: '/api/tvl.json',
    financialView: getFinancialView(ordering, l2Data, tvl),
    riskView: getRiskView(ordering),
    metadata: getPageMetadata(),
  }
}
