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
  const bridgesTvl = tvlApiResponse.bridges.hourly.data.at(-1)?.[1] ?? 0
  const bridgesTvlSevenDaysAgo = tvlApiResponse.bridges.hourly.data[0]?.[1] ?? 0
  const bridgesTvlSevenDayChange = getPercentageChange(
    bridgesTvl,
    bridgesTvlSevenDaysAgo,
  )

  const combinedTvl = tvlApiResponse.combined.hourly.data.at(-1)?.[1] ?? 0
  const combinedTvlSevenDaysAgo =
    tvlApiResponse.combined.hourly.data[0]?.[1] ?? 0
  const combinedTvlSevenDayChange = getPercentageChange(
    combinedTvl,
    combinedTvlSevenDaysAgo,
  )

  const included = getIncludedProjects(
    [...config.bridges, ...config.layer2s],
    tvlApiResponse,
  )
  const ordering = orderByTvl(included, tvlApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      bridgesTvl: formatUSD(bridgesTvl),
      bridgesTvlSevenDayChange,
      combinedTvl: formatUSD(combinedTvl),
      combinedTvlSevenDayChange,
      apiEndpoint: '/api/bridges-tvl.json',
      tvlView: {
        items: getBridgesTvlView(
          ordering,
          tvlApiResponse,
          bridgesTvl,
          combinedTvl,
        ),
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
