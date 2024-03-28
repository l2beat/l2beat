import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { getPageMetadata } from '../../activity/props/getPageMetadata'
import { CostsPagesData } from '../types'
import { ScalingCostsPageProps } from '../view/ScalingCostsPage'
import { getScalingCostsView } from './getScalingCostsView'

export function getProps(
  config: Config,
  pagesData: CostsPagesData,
): Wrapped<ScalingCostsPageProps> {
  return {
    props: {
      costsView: getScalingCostsView(config.layer2s, pagesData),
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
