import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props/getProps'
import { GovernancePublicationsPage } from './view/GovernancePublicationsPage'

export function getGovernancePublicationsPage(config: Config) {
  const { wrapper, props } = getProps(config)
  return {
    slug: '/governance/publications',
    page: (
      <PageWrapper {...wrapper}>
        <GovernancePublicationsPage {...props} />
      </PageWrapper>
    ),
  }
}
