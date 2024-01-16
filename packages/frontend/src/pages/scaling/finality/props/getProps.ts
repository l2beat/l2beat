import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { FinalityPagesData } from '../types'
import { FinalityPageProps } from '../view/ScalingFinalityPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingFinalityView } from './getScalingFinalityView'

export function getProps(
  config: Config,
  pagesData: FinalityPagesData,
): Wrapped<FinalityPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      finalityView: getScalingFinalityView(config.layer2s, pagesData),
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
