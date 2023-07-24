import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { PagesData } from '../Page'
import { getProps } from './props'
import { L2AssetsPage } from './view/L2AssetsPage'

export function getL2AssetsPage(config: Config, pagesData: PagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/l2assets',
    page: (
      <PageWrapper {...wrapper}>
        <L2AssetsPage {...props} />
      </PageWrapper>
    ),
  }
}
