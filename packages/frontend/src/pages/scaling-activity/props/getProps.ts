import { ApiActivity } from '@l2beat/types'

import { getPercentageChange } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { ActivityPageProps } from '../view/ActivityPage'
import { getActivityView } from './getActivityView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(config: Config): Wrapped<ActivityPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config),
      txCount: txCount.toString(),
      sevenDayChangeTxCount: sevenDayChange,
      apiEndpoint: '/api/activity.json',
      activityView: getActivityView(),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      metadata: getPageMetadata(),
    },
  }
}
