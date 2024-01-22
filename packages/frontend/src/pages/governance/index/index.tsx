import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props/getProps'
import { GovernancePage } from './view/GovernancePage'

export function getGovernancePage(config: Config) {
  const { wrapper, props } = getProps(config)
  return {
    slug: '/governance',
    page: (
      <PageWrapper {...wrapper}>
        <GovernancePage {...props} />
      </PageWrapper>
    ),
  }
}
