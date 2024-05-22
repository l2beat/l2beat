import React from 'react'

import { PageWrapper } from '../../../components'
import { getProps } from './props/getProps'
import { GovernancePublicationsPage } from './view/GovernancePublicationsPage'

export function getGovernancePublicationsPage() {
  const { wrapper, props } = getProps()
  return {
    slug: '/governance/publications',
    page: (
      <PageWrapper {...wrapper}>
        <GovernancePublicationsPage {...props} />
      </PageWrapper>
    ),
  }
}
