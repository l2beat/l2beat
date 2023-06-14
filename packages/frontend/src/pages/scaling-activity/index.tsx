import { ActivityApiResponse, VerificationStatus } from '@l2beat/shared-pure'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ActivityPage } from './view/ActivityPage'

export function getActivityPage(
  config: Config,
  pagesData: {
    activityApiResponse: ActivityApiResponse
    verificationStatus: VerificationStatus
  },
) {
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
