import { ActivityApiResponse } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getScalingFactor } from '../../../utils/activity/getScalingFactor'
import { Wrapped } from '../../Page'
import { ActivityPageProps } from '../view/ActivityPage'
import { getActivityView } from './getActivityView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  activityApiResponse: ActivityApiResponse,
): Wrapped<ActivityPageProps> {
  const scalingFactor = getScalingFactor(activityApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      scalingFactor,
      apiEndpoint: '/api/activity/combined.json',
      activityView: getActivityView(config.layer2s, activityApiResponse),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      metadata: getPageMetadata(),
      preloadApi: '/api/activity/combined.json',
    },
  }
}
