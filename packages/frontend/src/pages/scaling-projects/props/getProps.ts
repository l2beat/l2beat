import { Layer2 } from '@l2beat/config'

import { Config } from '../../../build/config'
import { PagesData } from '../../../build/types'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getChart } from '../../../utils/project/getChart'
import { getHeader } from '../../../utils/project/getHeader'
import { Wrapped } from '../../Page'
import { ProjectPageProps } from '../view/ProjectPage'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'
import { getProjectHeader } from './getProjectHeader'

export function getProps(
  project: Layer2,
  config: Config,
  pagesData: PagesData,
): Wrapped<ProjectPageProps> {
  const { tvlApiResponse, activityApiResponse, verificationStatus } = pagesData

  const chart = getChart(project, tvlApiResponse, config, activityApiResponse)
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      header: getHeader(project, tvlApiResponse, activityApiResponse),
      showProjectHeader: config.features.activity,
      projectHeader: getProjectHeader(
        project,
        tvlApiResponse,
        activityApiResponse,
      ),
      chart,
      projectDetails: getProjectDetails(project, verificationStatus),
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: chart.tvlEndpoint,
      metadata: getPageMetadata(project),
    },
  }
}
