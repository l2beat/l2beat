import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'
import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './props'
import { RiskPage } from './view/RiskPage'

export function getRiskPage(projects: Project[], apiMain: ApiMain) {
  const { props, wrapper } = getProps(projects, apiMain)
  return {
    slug: '/scaling/risk',
    page: (
      <PageWrapper {...wrapper}>
        <RiskPage {...props} />
      </PageWrapper>
    ),
  }
}
