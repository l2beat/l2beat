import { Project } from '@l2beat/config'
import { L2Data } from '../../L2Data'
import { ProjectPage } from './view/ProjectPage'
import { getProjectPage } from './props'

interface Props {
  project: Project
  l2Data: L2Data
}

export function Project(props: Props) {
  return <ProjectPage {...getProjectPage(props.project, props.l2Data)} />
}
