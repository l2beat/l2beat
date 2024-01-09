import { Layer3 } from '@l2beat/config'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getHeader } from '../../../utils/project/getHeader'
import { PagesData, Wrapped } from '../../Page'
import { ProjectPageProps } from '../view/ProjectPage'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'
import { getProjectHeader } from './getProjectHeader'

export function getProps(
  project: Layer3,
  config: Config,
  pagesData: PagesData,
): Wrapped<ProjectPageProps> {
  const { tvlApiResponse, activityApiResponse } = pagesData

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      header: getHeader(project, tvlApiResponse, activityApiResponse),
      projectHeader: getProjectHeader(project),
      projectDetails: getProjectDetails(project),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(project),
      banner: config.features.banner,
    },
  }
}
