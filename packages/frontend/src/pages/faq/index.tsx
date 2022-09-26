import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { FaqPage } from './FaqPage'
import { getProps } from './getProps'

export function getFaqPage(config: Config) {
  const { props, wrapper } = getProps(config)
  return {
    slug: '/faq',
    page: (
      <PageWrapper {...wrapper}>
        <FaqPage {...props} />
      </PageWrapper>
    ),
  }
}
