import { Project } from '@l2beat/config'
import { L2Data } from '../../../L2Data'
import { PageMetadata } from '../../../PageMetadata'
import { formatUSD, getFromEnd, getPercentageChange } from '../../../utils'
import { FinancialViewProps } from '../FinancialView/FinancialView'
import { getFinancialViewProps } from './getFinancialViewProps'
import { getRiskViewEntry, RiskViewEntry } from './getRiskViewEntry'

export interface HomePageProps {
  tvl: string
  sevenDayChange: string
  apiEndpoint: string
  financialViewProps: FinancialViewProps
  riskView: RiskViewEntry[]
  metadata: PageMetadata
}

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

  const riskView = ordering.map((x) => getRiskViewEntry(x))

  return {
    tvl: formatUSD(tvl),
    sevenDayChange,
    apiEndpoint: '/api/tvl.json',
    financialViewProps: getFinancialViewProps(ordering, l2Data, tvl),
    riskView,
    metadata: {
      title: 'L2BEAT – The state of the layer two ecosystem',
      description:
        'L2BEAT is a analytics and research website about Ethereum layer 2 scaling.',
      image: 'https://l2beat.com/meta-images/overview.png',
      url: 'https://l2beat.com/',
    },
  }
}
