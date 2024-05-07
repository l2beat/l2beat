import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { PagesData, Wrapped } from '../../../Page'
import { getDefaultPageMetadata } from '../../../metadata'
import { ScalingTvlPageProps } from '../view/ScalingTvlPage'
import { getScalingTvlView } from './getScalingTvlView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<ScalingTvlPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      footer: getFooterProps(config),
      tvlView: getScalingTvlView(
        config.layer2s,
        pagesData.tvlApiResponse,
        pagesData.implementationChange,
      ),
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image:
          'https://l2beat.com/meta-images/pages/og-scaling-value-locked.png',
        url: 'https://l2beat.com/scaling/tvl',
      }),
      banner: config.features.banner,
    },
  }
}
