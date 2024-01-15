import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { getTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { PagesData, Wrapped } from '../../../Page'
import { SummaryPageProps } from '../view/ScalingSummaryPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingSummaryView } from './getScalingSummaryView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<SummaryPageProps> {
  const { tvlApiResponse, verificationStatus } = pagesData

  const charts = tvlApiResponse.layers2s
  const { tvl } = getTvlWithChange(charts)

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      tvlView: getScalingSummaryView(
        [...config.layer2s, ...config.layer3s],
        tvlApiResponse,
        tvl,
        verificationStatus,
      ),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
      showLiveness: config.features.liveness,
      milestones: config.milestones,
    },
    wrapper: {
      preloadApi: getChartUrl({ type: 'layer2-tvl' }),
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
