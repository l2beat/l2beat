import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { getTvlWithChange } from '../../../utils/tvl/getTvlWitchChange'
import { formatUSD } from '../../../utils/utils'
import { PagesData, Wrapped } from '../../Page'
import { DetailedTvlPageProps } from '../view/DetailedTvlPage'
import { getDetailedTvlView } from './getDetailedTvlView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<DetailedTvlPageProps> {
  const { tvlApiResponse } = pagesData

  const charts = tvlApiResponse.layers2s

  const included = getIncludedProjects(config.layer2s, tvlApiResponse)
  const ordering = orderByTvl(included, tvlApiResponse)

  const { tvl, tvlWeeklyChange } = getTvlWithChange(charts)
  return {
    props: {
      showDetailedTvl: config.features.detailedTvl,
      showActivity: config.features.activity,
      navbar: getNavbarProps(config, 'scaling'),
      footer: getFooterProps(config),
      tvl: formatUSD(tvl),
      tvlWeeklyChange,
      detailedTvlView: getDetailedTvlView(config, ordering),
    },
    wrapper: {
      metadata: getPageMetadata(),
    },
  }
}
