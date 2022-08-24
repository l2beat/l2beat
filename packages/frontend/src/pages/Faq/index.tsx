import React from 'react'

import { PageWrapper } from '../../components'
import { FaqPage } from './FaqPage'
import { getProps } from './getProps'

export function getFaqPage() {
  const { props, wrapper } = getProps()
  return {
    slug: '/faq',
    page: (
      <PageWrapper {...wrapper}>
        <FaqPage {...props} />
      </PageWrapper>
    ),
  }
}
