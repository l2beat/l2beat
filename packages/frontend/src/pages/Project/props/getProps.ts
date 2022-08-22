import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { ProjectPageProps } from '../view/ProjectPage'
import { getChart } from './getChart'
import { getHeader } from './getHeader'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'

export function getProps(project: Project, apiMain: ApiMain): ProjectPageProps {
  return {
    metadata: getPageMetadata(project),
    header: getHeader(project, apiMain),
    chart: getChart(project, apiMain),
    projectDetails: getProjectDetails(project),
  }
}
