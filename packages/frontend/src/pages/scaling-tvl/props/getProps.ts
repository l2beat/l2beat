import { TvlApiResponse } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { getTvlWithChange } from '../../../utils/tvl/getTvlWitchChange'
import { formatUSD } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { TvlPageProps } from '../view/ScalingTvlPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingTvlView } from './getScalingTvlView'

export function getProps(
  config: Config,
  tvlApiResponse: TvlApiResponse,
): Wrapped<TvlPageProps> {
  const charts = tvlApiResponse.layers2s
  const { tvl, tvlWeeklyChange } = getTvlWithChange(charts)

  const included = getIncludedProjects(config.layer2s, tvlApiResponse)
  const ordering = orderByTvl(included, tvlApiResponse)
  const tvlEndpoint = '/api/scaling-tvl.json'

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      tvl: formatUSD(tvl),
      tvlWeeklyChange,
      tvlEndpoint,
      tvlView: getScalingTvlView(ordering, tvlApiResponse, tvl),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      preloadApi: tvlEndpoint,
      metadata: getPageMetadata(),
    },
  }
}
