import { Config } from '../../../build/config'
import { PagesData } from '../../../build/types'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getScalingFactor } from '../../../utils/activity/getScalingFactor'
import { Wrapped } from '../../Page'
import { ActivityPageProps } from '../view/ActivityPage'
import { getActivityView } from './getActivityView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<ActivityPageProps> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const activityApiResponse = pagesData.activityApiResponse!
  const verificationStatus = pagesData.verificationStatus

  const scalingFactor = getScalingFactor(activityApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      scalingFactor,
      apiEndpoint: '/api/activity/combined.json',
      activityView: getActivityView(
        config.layer2s,
        activityApiResponse,
        verificationStatus,
      ),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      metadata: getPageMetadata(),
      preloadApi: '/api/activity/combined.json',
    },
  }
}
