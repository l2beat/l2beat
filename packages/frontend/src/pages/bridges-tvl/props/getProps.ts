import { TvlApiResponse } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { formatUSD, getPercentageChange } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { BridgesTvlPageProps } from '../BridgesTvlPage'
import { getBridgesTvlView } from './getBridgesTvlView'

export function getProps(
  config: Config,
  tvlResponse: TvlApiResponse,
): Wrapped<BridgesTvlPageProps> {
  const tvl = tvlResponse.bridges.hourly.data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = tvlResponse.bridges.hourly.data[0]?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const included = getIncludedProjects(config.bridges, tvlResponse)
  const ordering = orderByTvl(included, tvlResponse)

  return {
    props: {
      navbar: getNavbarProps(config),
      tvl: formatUSD(tvl),
      sevenDayChange,
      apiEndpoint: '/api/bridges-tvl.json',
      tvlView: {
        items: getBridgesTvlView(ordering, tvlResponse, tvl),
      },
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: '/api/bridges-tvl.json',
      metadata: {
        description: '',
        image: '',
        title: '',
        url: '',
      },
    },
  }
}
