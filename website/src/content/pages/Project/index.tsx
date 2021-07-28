import { Project } from '@l2beat/config'
import { L2Data } from '../../L2Data'
import { ProjectPage } from './ProjectPage'
import { getProjectPageProps } from './props'

interface Props {
  project: Project
  l2Data: L2Data
}

export function Project(props: Props) {
  return <ProjectPage {...getProjectPageProps(props.project, props.l2Data)} />
}
