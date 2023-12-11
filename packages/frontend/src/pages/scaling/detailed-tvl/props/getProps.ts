import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { PagesData, Wrapped } from '../../../Page'
import { ScalingDetailedTvlPageProps } from '../view/ScalingDetailedTvlPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingDetailedTvlView } from './getScalingDetailedTvlView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<ScalingDetailedTvlPageProps> {
  return {
    props: {
      showActivity: config.features.activity,
      showLiveness: config.features.liveness,
      navbar: getNavbarProps(config, 'scaling'),
      footer: getFooterProps(config),
      detailedTvlView: getScalingDetailedTvlView(
        config.layer2s,
        pagesData.tvlApiResponse,
      ),
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
