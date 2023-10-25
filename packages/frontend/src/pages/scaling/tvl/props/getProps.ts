import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { getIncludedProjects } from '../../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { getTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { PagesData, Wrapped } from '../../../Page'
import { TvlPageProps } from '../view/ScalingTvlPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingTvlView } from './getScalingTvlView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<TvlPageProps> {
  const { tvlApiResponse, verificationStatus } = pagesData

  const charts = tvlApiResponse.layers2s
  const { tvl } = getTvlWithChange(charts)

  const included = getIncludedProjects(config.layer2s, tvlApiResponse)
  const ordering = orderByTvl(included, tvlApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      tvlView: getScalingTvlView(
        ordering,
        tvlApiResponse,
        tvl,
        verificationStatus,
      ),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
      milestones: config.milestones,
    },
    wrapper: {
      preloadApi: getChartUrl({ type: 'layer2-tvl' }),
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
