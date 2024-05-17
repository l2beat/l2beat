import { Config } from '../../../../build/config'
import { Wrapped } from '../../../Page'
import { getDefaultPageMetadata } from '../../../metadata'
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
      milestones: config.milestones,
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/pages/og-scaling-costs.png',
        url: 'https://l2beat.com/scaling/costs',
      }),
      banner: config.features.banner,
    },
  }
}
