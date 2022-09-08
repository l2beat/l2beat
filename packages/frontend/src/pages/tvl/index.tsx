import { Layer2 } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'
import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './props'
import { TvlPage } from './view/TvlPage'

export function getTvlPage(projects: Layer2[], apiMain: ApiMain) {
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
