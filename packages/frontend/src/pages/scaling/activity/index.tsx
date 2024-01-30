import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { ActivityPagesData } from './types'
import { ActivityPage } from './view/ScalingActivityPage'

export function getActivityPage(config: Config, pagesData: ActivityPagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/activity',
    page: (
      <PageWrapper {...wrapper}>
        <ActivityPage {...props} />
      </PageWrapper>
    ),
  }
}
