import { ActivityApiResponse, TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { getProps } from './props'
import { ProjectPage } from './view/ProjectPage'

export function getProjectPages(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse?: ActivityApiResponse,
) {
  const included = getIncludedProjects(config.layer2s, tvlApiResponse)
  return included.map((project) => {
    const { wrapper, props } = getProps(
      project,
      config,
      tvlApiResponse,
      activityApiResponse,
    )
    return {
      slug: `/scaling/projects/${project.display.slug}`,
      page: (
        <PageWrapper {...wrapper}>
          <ProjectPage {...props} />
        </PageWrapper>
      ),
    }
  })
}
