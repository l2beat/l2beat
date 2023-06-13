import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { DefinitionsPage } from './DefinitionsPage'
import { getProps } from './getProps'

export function getDefinitionsPage(config: Config) {
  const { props, wrapper } = getProps(config)
  return {
    slug: '/definitions',
    page: (
      <PageWrapper {...wrapper}>
        <DefinitionsPage {...props} />
      </PageWrapper>
    ),
  }
}
