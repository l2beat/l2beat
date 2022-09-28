import { TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { getProps } from './props'
import { ProjectPage } from './view/ProjectPage'

export function getBridgeProjectPages(
  config: Config,
  tvlResponse: TvlApiResponse,
) {
  const included = getIncludedProjects(config.bridges, tvlResponse)
  return included.map((bridge) => {
    const { wrapper, props } = getProps(bridge, config, tvlResponse)
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
