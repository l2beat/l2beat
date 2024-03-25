import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { getPageMetadata } from '../../activity/props/getPageMetadata'
import { L2CostsPagesData } from '../types'
import { ScalingL2CostsPageProps } from '../view/ScalingL2CostsPage'
import { getScalingL2CostsView } from './getScalingL2CostsView'

export function getProps(
  config: Config,
  pagesData: L2CostsPagesData,
): Wrapped<ScalingL2CostsPageProps> {
  return {
    props: {
      l2CostsView: getScalingL2CostsView(config.layer2s, pagesData),
      navbar: getNavbarProps(config, 'scaling'),
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
