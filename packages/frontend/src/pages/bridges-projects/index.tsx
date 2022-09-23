import { Bridge } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'
import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ProjectPage } from './view/ProjectPage'

export function getBridgeProjectPages(bridges: Bridge[], apiMain: ApiMain) {
  return bridges.map((bridge) => {
    const { wrapper, props } = getProps(bridge, apiMain)
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
