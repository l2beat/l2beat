import { ActivityApiResponse, TvlApiResponse } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getScalingFactor } from '../../../utils/activity/getScalingFactor'
import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { Wrapped } from '../../Page'
import { ActivityPageProps } from '../view/ActivityPage'
import { getActivityView } from './getActivityView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse: ActivityApiResponse,
): Wrapped<ActivityPageProps> {
  const data = activityApiResponse.combined.data
  const tpsDaily = getTpsDaily(data)
  const scalingFactor = getScalingFactor(activityApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      scalingFactor,
      apiEndpoint: '/api/scaling-activity.json',
      secondaryEndpoint: '/api/ethereum-activity.json',
      activityView: getActivityView(
        config.layer2s,
        tvlApiResponse,
        activityApiResponse,
        tpsDaily,
      ),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      metadata: getPageMetadata(),
      preloadApi: '/api/scaling-activity.json',
    },
  }
}
