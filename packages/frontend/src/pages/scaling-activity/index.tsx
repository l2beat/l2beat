import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ActivityPage } from './view/ActivityPage'

export function getActivityPage() {
  const { props, wrapper } = getProps()
  return {
    slug: '/scaling/activity',
    page: (
      <PageWrapper {...wrapper}>
        <ActivityPage {...props} />
      </PageWrapper>
    ),
  }
}
