import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { PagesData } from '../Page'
import { getProps } from './props'
import { ProjectPage } from './view/ProjectPage'

export function getBridgeProjectPages(config: Config, pagesData: PagesData) {
  const included = getIncludedProjects(
    config.bridges,
    pagesData.tvlApiResponse,
    config.features.buildAllProjectPages,
  )

  return included.map((bridge) => {
    const { wrapper, props } = getProps(bridge, config, pagesData)
    return {
      slug: `/bridges/projects/${bridge.display.slug}`,
      page: (
        <PageWrapper {...wrapper}>
          <ProjectPage {...props} />
        </PageWrapper>
      ),
    }
  })
}
