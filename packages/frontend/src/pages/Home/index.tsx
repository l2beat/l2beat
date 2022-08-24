import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'
import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './props'
import { HomePage } from './view/HomePage'

export function getHomePage(projects: Project[], apiMain: ApiMain) {
  const { props, wrapper } = getProps(projects, apiMain)
  return {
    slug: '/',
    page: (
      <PageWrapper {...wrapper}>
        <HomePage {...props} />
      </PageWrapper>
    ),
  }
}
