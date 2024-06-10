import { Config } from '../../../../build/config'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { Wrapped } from '../../../Page'
import { getDefaultPageMetadata } from '../../../metadata'
import { BridgesPagesData } from '../../types'
import { BridgesSummaryPageProps } from '../view/BridgesSummaryPage'
import { getBridgesSummaryView } from './getBridgesSummaryView'

export function getProps(
  config: Config,
  pagesData: BridgesPagesData,
): Wrapped<BridgesSummaryPageProps> {
  return {
    props: {
      tvlView: getBridgesSummaryView(
        [...config.bridges, ...config.layer2s],
        pagesData,
      ),
    },
    wrapper: {
      preloadApis: [
        getChartUrl({
          type: 'bridges-tvl',
          includeCanonical: false,
        }),
      ],
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/pages/og-bridges-summary.png',
        url: 'https://l2beat.com/bridges/summary',
      }),
      banner: config.features.banner,
    },
  }
}
