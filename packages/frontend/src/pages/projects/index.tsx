import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'
import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ProjectPage } from './view/ProjectPage'

export function getProjectPages(projects: Project[], apiMain: ApiMain) {
  return projects.map((project) => {
    const { wrapper, props } = getProps(project, apiMain)
    return {
      slug: `/projects/${project.slug}`,
      page: (
        <PageWrapper {...wrapper}>
          <ProjectPage {...props} />
        </PageWrapper>
      ),
    }
  })
}
