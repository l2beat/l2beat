import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getDefaultPageMetadata } from '../../../metadata'
import { Wrapped } from '../../../Page'
import { FeesPagesData } from '../types'
import { ScalingFeesPageProps } from '../view/ScalingFeesPage'
import { getScalingFeesView } from './getScalingFeesView'

export function getProps(
  config: Config,
  pagesData: FeesPagesData,
): Wrapped<ScalingFeesPageProps> {
  return {
    props: {
      feesView: getScalingFeesView(config.layer2s, pagesData),
      navbar: getNavbarProps(config, 'scaling'),
      footer: getFooterProps(config),
      milestones: config.milestones,
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/overview-scaling.png',
        url: 'https://l2beat.com/scaling/fees',
      }),
      banner: config.features.banner,
    },
  }
}
