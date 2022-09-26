import { Wrapped } from '../../Page'
import { ActivityPageProps } from '../view/ActivityPage'
import { getActivityView } from './getActivityView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(): Wrapped<ActivityPageProps> {
  return {
    props: {
      activityView: getActivityView(),
    },
    wrapper: {
      metadata: getPageMetadata(),
    },
  }
}
