import React from 'react'

import { Config } from '../../build/config'
import { PagesData } from '../../build/types'
import { PageWrapper } from '../../components'
import { BridgesTvlPage } from './BridgesTvlPage'
import { getProps } from './props'

export function getBridgesTvlPage(config: Config, pagesData: PagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/bridges/tvl',
    page: (
      <PageWrapper {...wrapper}>
        <BridgesTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
