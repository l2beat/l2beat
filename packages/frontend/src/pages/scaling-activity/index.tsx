import { ActivityApiResponse, TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ActivityPage } from './view/ActivityPage'

export function getActivityPage(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse: ActivityApiResponse,
) {
  const { props, wrapper } = getProps(
    config,
    tvlApiResponse,
    activityApiResponse,
  )
  return {
    slug: '/scaling/activity',
    page: (
      <PageWrapper {...wrapper}>
        <ActivityPage {...props} />
      </PageWrapper>
    ),
  }
}
