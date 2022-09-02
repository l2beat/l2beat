import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { Wrapped } from '../../Page'
import { ProjectPageProps } from '../view/ProjectPage'
import { getChart } from './getChart'
import { getHeader } from './getHeader'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'

export function getProps(
  project: Project,
  apiMain: ApiMain,
): Wrapped<ProjectPageProps> {
  const chart = getChart(project, apiMain)
  return {
    props: {
      header: getHeader(project, apiMain),
      chart,
      projectDetails: getProjectDetails(project),
    },
    wrapper: {
      preloadApi: chart.endpoint,
      metadata: getPageMetadata(project),
    },
  }
}
