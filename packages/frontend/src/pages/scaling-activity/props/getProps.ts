import { ActivityApiResponse } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../utils/activity/getTpsWeeklyChange'
import { Wrapped } from '../../Page'
import { ActivityPageProps } from '../view/ActivityPage'
import { getActivityView } from './getActivityView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  activityApiResponse: ActivityApiResponse,
): Wrapped<ActivityPageProps> {
  const data = activityApiResponse.combined.data
  const tpsDaily = getTpsDaily(data)
  const tpsWeeklyChange = getTpsWeeklyChange(data)

  return {
    props: {
      navbar: getNavbarProps(config),
      tpsDaily: tpsDaily?.toString() ?? '',
      tpsWeeklyChange,
      apiEndpoint: '/api/scaling-activity.json',
      activityView: getActivityView(config.layer2s, activityApiResponse),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      metadata: getPageMetadata(),
      preloadApi: '/api/scaling-activity.json',
    },
  }
}
