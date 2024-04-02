import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getDefaultPageMetadata } from '../../../metadata'
import { Wrapped } from '../../../Page'
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
      milestones: config.milestones,
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/overview-scaling.png',
        url: 'https://l2beat.com/scaling/costs',
      }),
      banner: config.features.banner,
    },
  }
}
