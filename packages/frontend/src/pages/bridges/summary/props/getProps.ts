import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { Wrapped } from '../../../Page'
import { BridgesPagesData } from '../../types'
import { BridgesSummaryPageProps } from '../view/BridgesSummaryPage'
import { getBridgesSummaryView } from './getBridgesSummaryView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  pagesData: BridgesPagesData,
): Wrapped<BridgesSummaryPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      tvlView: getBridgesSummaryView(
        [...config.bridges, ...config.layer2s],
        pagesData,
      ),
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: getChartUrl({ type: 'bridges-tvl', includeCanonical: false }),
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
