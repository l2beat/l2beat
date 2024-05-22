import React from 'react'

import { PageWrapper } from '../../../components'
import { getProps } from './props/getProps'
import { GovernancePublicationsPage } from './view/GovernancePublicationsPage'
import { Config } from '../../../build/config'

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
