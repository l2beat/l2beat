import { Config } from '../../../../build/config'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { getTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { PagesData, Wrapped } from '../../../Page'
import { getDefaultPageMetadata } from '../../../metadata'
import { SummaryPageProps } from '../view/ScalingSummaryPage'
import { getScalingSummaryView } from './getScalingSummaryView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<SummaryPageProps> {
  const { tvlApiResponse, verificationStatus, implementationChange } = pagesData

  const charts = tvlApiResponse.layers2s
  const { tvl } = getTvlWithChange(charts)

  return {
    props: {
      tvlView: getScalingSummaryView(
        [...config.layer2s, ...config.layer3s],
        tvlApiResponse,
        tvl,
        verificationStatus,
        implementationChange,
        config.features,
      ),
      milestones: config.milestones,
    },
    wrapper: {
      preloadApis: [getChartUrl({ type: 'scaling-tvl' })],
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/pages/og-scaling-summary.png',
        url: 'https://l2beat.com/scaling/summary',
      }),
      banner: config.features.banner,
    },
  }
}
