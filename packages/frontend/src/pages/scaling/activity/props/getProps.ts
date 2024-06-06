import { Config } from '../../../../build/config'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { Wrapped } from '../../../Page'
import { getDefaultPageMetadata } from '../../../metadata'
import { ActivityPagesData } from '../types'
import { ActivityPageProps } from '../view/ScalingActivityPage'
import { getScalingActivityView } from './getScalingActivityView'

export function getProps(
  config: Config,
  pagesData: ActivityPagesData,
): Wrapped<ActivityPageProps> {
  return {
    props: {
      activityView: getScalingActivityView(
        [...config.layer2s, ...config.layer3s],
        pagesData,
      ),
      milestones: config.milestones,
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/pages/og-scaling-activity.png',
        url: 'https://l2beat.com/scaling/activity',
      }),
      preloadApis: [getChartUrl({ type: 'scaling-activity' })],
      banner: config.features.banner,
    },
  }
}
