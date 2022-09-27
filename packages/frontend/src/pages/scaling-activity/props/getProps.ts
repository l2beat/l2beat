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
  const txCount = apiActivity.combined.data.at(-1)?.[1] ?? 0
  const txCountSevenDaysAgo = apiActivity.combined.data.at(-7)?.[1] ?? 0
  const sevenDayChange = getPercentageChange(txCount, txCountSevenDaysAgo)

  return {
    props: {
      navbar: getNavbarProps(config),
      txCount: txCount.toString(),
      sevenDayChangeTxCount: sevenDayChange,
      apiEndpoint: '/api/scaling-activity.json',
      activityView: getActivityView(),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      metadata: getPageMetadata(),
    },
  }
}
