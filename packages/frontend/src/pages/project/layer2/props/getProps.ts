import { Layer2 } from '@l2beat/config'
import compact from 'lodash/compact'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { getCharts } from '../../../../utils/project/getCharts'
import { PagesData, Wrapped } from '../../../Page'
import { getPageMetadata } from '../../common/getPageMetadata'
import { getProjectHeader } from '../../common/getProjectHeader'
import { ProjectPageProps } from '../view/ProjectPage'
import { getProjectDetails } from './getProjectDetails'

export function getProps(
  project: Layer2,
  config: Config,
  pagesData: PagesData,
): Wrapped<ProjectPageProps> {
  const {
    tvlApiResponse,
    activityApiResponse,
    l2CostsApiResponse,
    verificationStatus,
    manuallyVerifiedContracts,
    implementationChange,
  } = pagesData

  const charts = getCharts(
    project,
    tvlApiResponse,
    config,
    activityApiResponse,
    l2CostsApiResponse,
  )
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      projectHeader: getProjectHeader(
        project,
        config,
        tvlApiResponse,
        implementationChange,
        activityApiResponse,
      ),
      projectDetails: getProjectDetails(
        project,
        verificationStatus,
        manuallyVerifiedContracts,
        implementationChange,
        charts,
      ),
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApis: compact([
        charts.tvl && getChartUrl(charts.tvl.initialType),
        charts.activity && getChartUrl(charts.activity.initialType),
        charts.costs && getChartUrl(charts.costs.initialType),
      ]),
      metadata: getPageMetadata(project),
      banner: config.features.banner,
    },
  }
}
