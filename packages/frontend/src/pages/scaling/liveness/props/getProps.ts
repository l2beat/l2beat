import { LivenessApiResponse } from '@l2beat/shared-pure'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { ScalingLivenessPageProps } from '../view/ScalingLivenessPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingLivenessView } from './getScalingLivenessView'

export function getProps(
  config: Config,
  livenessData: LivenessApiResponse,
): Wrapped<ScalingLivenessPageProps> {
  return {
    props: {
      livenessView: getScalingLivenessView(config.layer2s, livenessData),
      navbar: getNavbarProps(config, 'scaling'),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      banner: config.features.banner,
      metadata: getPageMetadata(),
    },
  }
}
