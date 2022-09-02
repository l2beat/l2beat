import React from 'react'

import { PageWrapper } from '../../components'
import { DonatePage } from './DonatePage'
import { getProps } from './getProps'

export async function getDonatePage() {
  const { wrapper, props } = await getProps()
  return {
    slug: '/donate',
    page: (
      <PageWrapper {...wrapper}>
        <DonatePage {...props} />
      </PageWrapper>
    ),
  }
}
