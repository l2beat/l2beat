import { ActivityApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ActivityPage } from './view/ActivityPage'

export function getActivityPage(
  config: Config,
  activityResponse: ActivityApiResponse,
) {
  const { props, wrapper } = getProps(config, activityResponse)
  return {
    slug: '/scaling/activity',
    page: (
      <PageWrapper {...wrapper}>
        <ActivityPage {...props} />
      </PageWrapper>
    ),
  }
}
