import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getCollection } from '../../../content/getCollection'
import { getProps } from './props/getProps'
import { GovernanceAllPublicationsPage } from './view/GovernanceAllPublicationsPage'

export function getGovernanceAllPublicationsPage(config: Config) {
  const publications = getCollection('publications')

  const { wrapper, props } = getProps(config, publications)

  return {
    slug: '/governance/publications',
    page: (
      <PageWrapper {...wrapper}>
        <GovernanceAllPublicationsPage {...props} />
      </PageWrapper>
    ),
  }
}
