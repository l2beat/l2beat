import {
  ImplementationChangeReportApiResponse,
  LivenessApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getDefaultPageMetadata } from '../../../metadata'
import { Wrapped } from '../../../Page'
import { ScalingLivenessPageProps } from '../view/ScalingLivenessPage'
import { getScalingLivenessView } from './getScalingLivenessView'

export interface LivenessPagesData {
  tvlApiResponse: TvlApiResponse
  livenessApiResponse: LivenessApiResponse
  implementationChange?: ImplementationChangeReportApiResponse
}

export function getProps(
  config: Config,
  pagesData: LivenessPagesData,
): Wrapped<ScalingLivenessPageProps> {
  return {
    props: {
      livenessView: getScalingLivenessView(config.layer2s, pagesData),
      navbar: getNavbarProps(config, 'scaling'),
      footer: getFooterProps(config),
    },
    wrapper: {
      banner: config.features.banner,
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/pages/og-scaling-liveness.png',
        url: 'https://l2beat.com/scaling/liveness',
      }),
    },
  }
}
