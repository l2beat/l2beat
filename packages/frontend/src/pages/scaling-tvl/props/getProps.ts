import { TvlApiResponse } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { formatUSD, getPercentageChange } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { TvlPageProps } from '../view/ScalingTvlPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingTvlView } from './getScalingTvlView'

export function getProps(
  config: Config,
  tvlResponse: TvlApiResponse,
): Wrapped<TvlPageProps> {
  const tvl = tvlResponse.layers2s.hourly.data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = tvlResponse.layers2s.hourly.data[0]?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const included = getIncludedProjects(config.layer2s, tvlResponse)
  const ordering = orderByTvl(included, tvlResponse)

  return {
    props: {
      navbar: getNavbarProps(config),
      tvl: formatUSD(tvl),
      sevenDayChange,
      apiEndpoint: '/api/scaling-tvl.json',
      tvlView: getScalingTvlView(ordering, tvlResponse, tvl),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      preloadApi: '/api/scaling-tvl.json',
      metadata: getPageMetadata(),
    },
  }
}
