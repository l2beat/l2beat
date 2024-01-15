import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { PagesData, Wrapped } from '../../../Page'
import { FinalityPageProps } from '../view/ScalingFinalityPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingFinalityView } from './getScalingFinalityView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<FinalityPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'finality'),
      finalityView: getScalingFinalityView(config.layer2s),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
      showLiveness: config.features.liveness,
      showFinality: config.features.finality,
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
