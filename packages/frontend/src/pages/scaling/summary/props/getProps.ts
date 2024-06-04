import { Config } from '../../../../build/config'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { Wrapped } from '../../../Page'
import { getDefaultPageMetadata } from '../../../metadata'
import { SummaryPagesData } from '../types'
import { SummaryPageProps } from '../view/ScalingSummaryPage'
import { getScalingSummaryView } from './getScalingSummaryView'

export function getProps(
  config: Config,
  pagesData: SummaryPagesData,
): Wrapped<SummaryPageProps> {
  return {
    props: {
      tvlView: getScalingSummaryView(
        [...config.layer2s, ...config.layer3s],
        pagesData,
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
