import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { PagesData, Wrapped } from '../../../Page'
import { ScalingTvlPageProps } from '../view/ScalingTvlPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingTvlView } from './getScalingTvlView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<ScalingTvlPageProps> {
  return {
    props: {
      showActivity: config.features.activity,
      showLiveness: config.features.liveness,
      showFinality: config.features.finality,
      navbar: getNavbarProps(config, 'scaling'),
      footer: getFooterProps(config),
      tvlView: getScalingTvlView(
        config.layer2s,
        pagesData.tvlApiResponse,
        pagesData.implementationChange,
      ),
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
