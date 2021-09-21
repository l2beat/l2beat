import { Project } from '@l2beat/config'
import React from 'react'

import { L2Data } from '../../L2Data'
import { getProjectPage } from './props'
import { ProjectPage } from './view/ProjectPage'

interface Props {
  project: Project
  l2Data: L2Data
}

export function Project(props: Props) {
  return <ProjectPage {...getProjectPage(props.project, props.l2Data)} />
}
