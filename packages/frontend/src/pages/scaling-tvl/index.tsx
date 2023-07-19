import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { PagesData } from '../Page'
import { getProps } from './props'
import { ScalingTvlPage } from './view/ScalingTvlPage'

export function getTvlPage(config: Config, pagesData: PagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/summary',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
