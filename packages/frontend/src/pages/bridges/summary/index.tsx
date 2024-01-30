import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { PagesData } from '../../Page'
import { getProps } from './props'
import { BridgesSummaryPage } from './view/BridgesSummaryPage'

export function getBridgesSummaryPage(config: Config, pagesData: PagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/bridges/summary',
    page: (
      <PageWrapper {...wrapper}>
        <BridgesSummaryPage {...props} />
      </PageWrapper>
    ),
  }
}
