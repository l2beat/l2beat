import { Project } from '@l2beat/config'
import { L2Data } from '../../../L2Data'
import { formatUSD, getFromEnd, getPercentageChange } from '../../../utils'
import { HomePageProps } from '../HomePage'
import { getFinancialViewProps } from './getFinancialViewProps'
import { getPageMetadata } from './getPageMetadata'
import { getRiskViewProps } from './getRiskViewProps'

export function getHomePageProps(
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
    financialViewProps: getFinancialViewProps(ordering, l2Data, tvl),
    riskViewProps: getRiskViewProps(ordering),
    metadata: getPageMetadata(),
  }
}
