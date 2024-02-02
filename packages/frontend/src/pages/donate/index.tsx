import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props/getProps'
import { DonatePage } from './view/DonatePage'

export async function getDonatePage(config: Config) {
  const { wrapper, props } = await getProps(config)
  return {
    slug: '/donate',
    page: (
      <PageWrapper {...wrapper}>
        <DonatePage {...props} />
      </PageWrapper>
    ),
  }
}
