import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { getDefaultPageMetadata } from '../../../metadata'
import { Wrapped } from '../../../Page'
import { ActivityPagesData } from '../types'
import { ActivityPageProps } from '../view/ScalingActivityPage'
import { getScalingActivityView } from './getScalingActivityView'

export function getProps(
  config: Config,
  pagesData: ActivityPagesData,
): Wrapped<ActivityPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      activityView: getScalingActivityView(
        [...config.layer2s, ...config.layer3s],
        pagesData,
      ),
      footer: getFooterProps(config),
      milestones: config.milestones,
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/overview-scaling-activity.png',
        url: 'https://l2beat.com/scaling/activity',
      }),
      preloadApis: [getChartUrl({ type: 'scaling-activity' })],
      banner: config.features.banner,
    },
  }
}
