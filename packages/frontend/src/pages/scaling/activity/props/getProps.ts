import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { Wrapped } from '../../../Page'
import { ActivityPagesData } from '../types'
import { ActivityPageProps } from '../view/ScalingActivityPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingActivityView } from './getScalingActivityView'

export function getProps(
  config: Config,
  pagesData: ActivityPagesData,
): Wrapped<ActivityPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      activityView: getScalingActivityView(config.layer2s, pagesData),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
      showLiveness: config.features.liveness,
      showFinality: config.features.finality,
      milestones: config.milestones,
    },
    wrapper: {
      metadata: getPageMetadata(),
      preloadApi: getChartUrl({ type: 'layer2-activity' }),
      banner: config.features.banner,
    },
  }
}
