import React from 'react'

import { PageWrapper } from '../../../components'
import { getProps } from './props/getProps'
import { GovernancePage } from './view/GovernancePage'

export function getGovernancePage() {
  const { wrapper, props } = getProps()
  return {
    slug: '/governance',
    page: (
      <PageWrapper {...wrapper}>
        <GovernancePage {...props} />
      </PageWrapper>
    ),
  }
}
