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
  tvlApiResponse: TvlApiResponse,
): Wrapped<BridgesTvlPageProps> {
  const tvl = tvlApiResponse.bridges.hourly.data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = tvlApiResponse.bridges.hourly.data[0]?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const included = getIncludedProjects(config.bridges, tvlApiResponse)
  const ordering = orderByTvl(included, tvlApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config),
      tvl: formatUSD(tvl),
      sevenDayChange,
      apiEndpoint: '/api/bridges-tvl.json',
      tvlView: {
        items: getBridgesTvlView(ordering, tvlApiResponse, tvl),
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
