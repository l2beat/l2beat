import { Project } from '@l2beat/config'

import { L2Data } from '../../../L2Data'
import { ProjectPageProps } from '../view/ProjectPage'
import { getChart } from './getChart'
import { getHeader } from './getHeader'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'

export function getProps(project: Project, l2Data: L2Data): ProjectPageProps {
  return {
    metadata: getPageMetadata(project),
    header: getHeader(project, l2Data),
    chart: getChart(project, l2Data),
    projectDetails: getProjectDetails(project, l2Data),
  }
}
