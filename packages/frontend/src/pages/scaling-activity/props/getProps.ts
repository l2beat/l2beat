import { Config } from '../../../build/config'
import { getFooterProps } from '../../../components'
import { Wrapped } from '../../Page'
import { ActivityPageProps } from '../view/ActivityPage'
import { getActivityView } from './getActivityView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(config: Config): Wrapped<ActivityPageProps> {
  return {
    props: {
      activityView: getActivityView(),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(),
    },
  }
}
