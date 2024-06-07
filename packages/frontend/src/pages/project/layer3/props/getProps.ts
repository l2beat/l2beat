import { Layer3 } from '@l2beat/config'
import compact from 'lodash/compact'

import { Config } from '../../../../build/config'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { PagesData, Wrapped } from '../../../Page'
import { getCharts } from '../../common/getCharts'
import { getPageMetadata } from '../../common/getPageMetadata'
import { getProjectHeader } from '../../common/getProjectHeader'
import { ProjectPageProps } from '../view/ProjectPage'
import { getProjectDetails } from './getProjectDetails'

export function getProps(
  project: Layer3,
  config: Config,
  pagesData: PagesData,
): Wrapped<ProjectPageProps> {
  const {
    tvlApiResponse,
    activityApiResponse,
    tvlBreakdownApiResponse,
    verificationStatus,
    manuallyVerifiedContracts,
    implementationChange,
  } = pagesData

  const charts = getCharts(project, tvlApiResponse, config, activityApiResponse)
  return {
    props: {
      projectHeader: getProjectHeader(
        project,
        config,
        tvlApiResponse,
        implementationChange,
        activityApiResponse,
        config.features.layer3sTvl ? tvlBreakdownApiResponse : undefined,
      ),
      projectDetails: getProjectDetails(
        project,
        verificationStatus,
        manuallyVerifiedContracts,
        implementationChange,
        charts,
        config.features,
      ),
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
