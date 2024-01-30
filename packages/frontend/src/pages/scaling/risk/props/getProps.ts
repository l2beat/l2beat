import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { ScalingRiskPagesData } from '../types'
import { ScalingRiskPageProps } from '../view/ScalingRiskPage'
import { getPageMetadata } from './getPageMetadata'
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
