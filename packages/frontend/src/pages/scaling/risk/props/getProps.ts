import { Config } from '../../../../build/config'
import { Wrapped } from '../../../Page'
import { getDefaultPageMetadata } from '../../../metadata'
import { ScalingRiskPagesData } from '../types'
import { ScalingRiskPageProps } from '../view/ScalingRiskPage'
import { getScalingRiskView } from './getScalingRiskView'

export function getProps(
  config: Config,
  pagesData: ScalingRiskPagesData,
): Wrapped<ScalingRiskPageProps> {
  return {
    props: {
      riskView: getScalingRiskView(config.layer2s, pagesData),
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/pages/og-scaling-risks.png',
        url: 'https://l2beat.com/scaling/risk',
      }),
      banner: config.features.banner,
    },
  }
}
