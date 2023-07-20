import { Layer2 } from '@l2beat/config'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getChart } from '../../../utils/project/getChart'
import { getHeader } from '../../../utils/project/getHeader'
import { PagesData, Wrapped } from '../../Page'
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
      projectHeader: getProjectHeader(
        project,
        config,
        tvlApiResponse,
        activityApiResponse,
      ),
      projectDetails: getProjectDetails(
        project,
        config,
        verificationStatus,
        chart,
      ),
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: chart.tvlEndpoint,
      metadata: getPageMetadata(project),
    },
  }
}
