import { Layer2 } from '@l2beat/config'
import { ActivityApiResponse, TvlApiResponse } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getChart } from '../../../utils/project/getChart'
import { getHeader } from '../../../utils/project/getHeader'
import { Wrapped } from '../../Page'
import { ProjectPageProps } from '../view/ProjectPage'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'

export function getProps(
  project: Layer2,
  config: Config,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse?: ActivityApiResponse,
): Wrapped<ProjectPageProps> {
  const chart = getChart(project, tvlApiResponse, config, activityApiResponse)
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      header: getHeader(project, tvlApiResponse, activityApiResponse),
      chart,
      projectDetails: getProjectDetails(project),
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: chart.tvlEndpoint,
      metadata: getPageMetadata(project),
    },
  }
}
