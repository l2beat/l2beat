import { LivenessApiResponse, TvlApiResponse } from '@l2beat/shared-pure'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { ScalingLivenessPageProps } from '../view/ScalingLivenessPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingLivenessView } from './getScalingLivenessView'

export interface LivenessPagesData {
  tvlApiResponse: TvlApiResponse
  livenessApiResponse: LivenessApiResponse
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
      showActivity: config.features.activity,
      showLiveness: config.features.liveness,
      showFinality: config.features.finality,
    },
    wrapper: {
      banner: config.features.banner,
      metadata: getPageMetadata(),
    },
  }
}
