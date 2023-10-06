import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getChartUrl } from '../../../scripts/charts/ChartDataController'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { getTvlWithChange } from '../../../utils/tvl/getTvlWitchChange'
import { formatUSD } from '../../../utils/utils'
import { PagesData, Wrapped } from '../../Page'
import { TvlPageProps } from '../view/ScalingTvlPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingTvlView } from './getScalingTvlView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<TvlPageProps> {
  const { tvlApiResponse, verificationStatus } = pagesData

  const charts = tvlApiResponse.layers2s
  const { tvl, tvlWeeklyChange } = getTvlWithChange(charts)

  const included = getIncludedProjects(config.layer2s, tvlApiResponse)
  const ordering = orderByTvl(included, tvlApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      tvl: formatUSD(tvl),
      tvlWeeklyChange,
      tvlView: getScalingTvlView(
        config,
        ordering,
        tvlApiResponse,
        tvl,
        verificationStatus,
      ),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
      showDetailedTvl: config.features.detailedTvl,
      milestones: config.milestones,
    },
    wrapper: {
      preloadApi: getChartUrl({ type: 'layer2-tvl' }),
      metadata: getPageMetadata(),
    },
  }
}
