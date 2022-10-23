import { TvlApiResponse } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { getTvlWithChange } from '../../../utils/tvl/getTvlWitchChange'
import { formatUSD } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { BridgesTvlPageProps } from '../BridgesTvlPage'
import { getBridgesTvlView } from './getBridgesTvlView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  tvlApiResponse: TvlApiResponse,
): Wrapped<BridgesTvlPageProps> {
  const { tvl: bridgesTvl, tvlWeeklyChange: bridgesTvlSevenDayChange } =
    getTvlWithChange(tvlApiResponse.bridges)
  const { tvl: combinedTvl, tvlWeeklyChange: combinedTvlSevenDayChange } =
    getTvlWithChange(tvlApiResponse.combined)

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
      tvlEndpoint: '/api/bridges-tvl.json',
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
      metadata: getPageMetadata(),
    },
  }
}
