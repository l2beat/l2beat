import React from 'react'

import { Config } from '../../build/config'
import { PagesData } from '../../build/types'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ScalingTvlPage } from './view/ScalingTvlPage'

export function getTvlPage(config: Config, pagesData: PagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/tvl',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
