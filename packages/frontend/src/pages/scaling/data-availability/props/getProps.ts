import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { DataAvailabilityPagesData } from '../types'
import { ScalingDataAvailabilityPageProps } from '../view/ScalingDataAvailabilityPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingDataAvailabilityView } from './getScalingDataAvailabilityView'

export function getProps(
  config: Config,
  pagesData: DataAvailabilityPagesData,
): Wrapped<ScalingDataAvailabilityPageProps> {
  return {
    props: {
      dataAvailabilityView: getScalingDataAvailabilityView(
        config.layer2s,
        pagesData,
      ),
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
