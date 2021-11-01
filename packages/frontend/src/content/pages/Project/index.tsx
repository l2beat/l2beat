import { Project } from '@l2beat/config'
import React from 'react'

import { L2Data } from '../../L2Data'
import { getProps } from './props'
import { ProjectPage } from './view/ProjectPage'

export function getProjectPages(projects: Project[], l2Data: L2Data) {
  return projects.map((project) => ({
    slug: `/projects/${project.slug}`,
    page: <ProjectPage {...getProps(project, l2Data)} />,
  }))
}
