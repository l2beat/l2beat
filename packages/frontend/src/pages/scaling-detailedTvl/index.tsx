import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { PagesData } from '../Page'
import { getProps } from './props'
import { DetailedTvlPage } from './view/DetailedTvlPage'

export function getDetailedTvlPage(config: Config, pagesData: PagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/detailedTvl',
    page: (
      <PageWrapper {...wrapper}>
        <DetailedTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
