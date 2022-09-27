import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { Wrapped } from '../../Page'
import { ActivityPageProps } from '../view/ActivityPage'
import { getActivityView } from './getActivityView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(config: Config): Wrapped<ActivityPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config),
      txCount: '100000',
      sevenDayChangeTxCount: '+12%',
      apiEndpoint: '/api/tvl.json',
      activityView: getActivityView(),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      metadata: getPageMetadata(),
    },
  }
}
