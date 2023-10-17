import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { getIncludedProjects } from '../../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { getTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { PagesData, Wrapped } from '../../../Page'
import { BridgesTvlPageProps } from '../BridgesTvlPage'
import { getBridgesTvlView } from './getBridgesTvlView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<BridgesTvlPageProps> {
  const { tvlApiResponse, verificationStatus } = pagesData

  const { tvl: bridgesTvl } = getTvlWithChange(tvlApiResponse.bridges)
  const { tvl: combinedTvl } = getTvlWithChange(tvlApiResponse.combined)

  const included = getIncludedProjects(
    [...config.bridges, ...config.layer2s],
    tvlApiResponse,
  )
  const ordering = orderByTvl(included, tvlApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      tvlView: {
        items: getBridgesTvlView(
          ordering,
          tvlApiResponse,
          bridgesTvl,
          combinedTvl,
          verificationStatus,
        ),
      },
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: getChartUrl({ type: 'bridges-tvl', includeCanonical: false }),
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
