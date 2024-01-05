import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { PagesData } from '../Page'
import { getProps } from './props'
import { ProjectPage } from './view/ProjectPage'

export function getL3sProjectPages(config: Config, pagesData: PagesData) {
  return config.layer3s.map((project) => {
    const { wrapper, props } = getProps(project, config, pagesData)

    return {
      slug: `/scaling/projects/${project.display.slug}`,
      page: (
        <PageWrapper {...wrapper} bodyClassName="flex flex-col min-h-screen">
          <ProjectPage {...props} />
        </PageWrapper>
      ),
    }
  })
}
