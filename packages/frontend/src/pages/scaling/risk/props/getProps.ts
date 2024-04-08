import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getDefaultPageMetadata } from '../../../metadata'
import { Wrapped } from '../../../Page'
import { ScalingRiskPagesData } from '../types'
import { ScalingRiskPageProps } from '../view/ScalingRiskPage'
import { getScalingRiskView } from './getScalingRiskView'

export function getProps(
  config: Config,
  pagesData: ScalingRiskPagesData,
): Wrapped<ScalingRiskPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      riskView: getScalingRiskView(config.layer2s, pagesData),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/overview-scaling.png',
        url: 'https://l2beat.com/scaling/risk',
      }),
      banner: config.features.banner,
    },
  }
}
