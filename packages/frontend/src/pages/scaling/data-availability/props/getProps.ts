import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getDefaultPageMetadata } from '../../../metadata'
import { Wrapped } from '../../../Page'
import { DataAvailabilityPagesData } from '../types'
import { ScalingDataAvailabilityPageProps } from '../view/ScalingDataAvailabilityPage'
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
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/overview-detailed-scaling.png',
        url: 'https://l2beat.com/scaling/data-availability',
      }),
      banner: config.features.banner,
    },
  }
}
