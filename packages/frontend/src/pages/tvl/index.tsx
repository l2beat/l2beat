import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'
import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './props'
import { TvlPage } from './view/TvlPage'

export function getTvlPage(projects: Project[], apiMain: ApiMain) {
  const { props, wrapper } = getProps(projects, apiMain)
  return {
    slug: '/scaling/tvl',
    page: (
      <PageWrapper {...wrapper}>
        <TvlPage {...props} />
      </PageWrapper>
    ),
  }
}
