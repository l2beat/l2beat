import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { getTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { getDefaultPageMetadata } from '../../../metadata'
import { PagesData, Wrapped } from '../../../Page'
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
      navbar: getNavbarProps(config, 'scaling'),
      tvlView: getScalingSummaryView(
        [...config.layer2s, ...config.layer3s],
        tvlApiResponse,
        tvl,
        verificationStatus,
        implementationChange,
      ),
      footer: getFooterProps(config),
      milestones: config.milestones,
    },
    wrapper: {
      preloadApis: [getChartUrl({ type: 'scaling-tvl' })],
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/overview-scaling.png',
        url: 'https://l2beat.com/scaling/summary',
      }),
      banner: config.features.banner,
    },
  }
}
