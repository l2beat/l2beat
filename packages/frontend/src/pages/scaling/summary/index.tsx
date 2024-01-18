import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { PagesData } from '../../Page'
import { getProps } from './props'
import { ScalingSummaryPage } from './view/ScalingSummaryPage'

export function getSummaryPage(config: Config, pagesData: PagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/summary',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingSummaryPage {...props} />
      </PageWrapper>
    ),
  }
}
