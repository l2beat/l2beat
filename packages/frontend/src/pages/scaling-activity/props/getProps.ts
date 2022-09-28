import { ApiActivity } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getPercentageChange } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { ActivityPageProps } from '../view/ActivityPage'
import { getActivityView } from './getActivityView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  apiActivity: ApiActivity,
): Wrapped<ActivityPageProps> {
  const SECONDS_IN_A_DAY = 24 * 60 * 60
  const tps = (apiActivity.combined.data.at(-1)?.[1] ?? 0) / SECONDS_IN_A_DAY
  const tpsSevenDaysAgo =
    (apiActivity.combined.data.at(-7)?.[1] ?? 0) / SECONDS_IN_A_DAY
  const sevenDayChange = getPercentageChange(tps, tpsSevenDaysAgo)

  return {
    props: {
      navbar: getNavbarProps(config),
      tpsDaily: tps.toFixed(2).toString(),
      tpsWeeklyChange: sevenDayChange,
      apiEndpoint: '/api/scaling-activity.json',
      activityView: getActivityView(),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      metadata: getPageMetadata(),
      preloadApi: '/api/scaling-activity.json',
    },
  }
}
