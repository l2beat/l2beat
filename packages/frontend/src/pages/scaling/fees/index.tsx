import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { FeesPagesData } from './types'
import { ScalingFeesPage } from './view/ScalingFeesPage'

export function getFeesPage(config: Config, pagesData: FeesPagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/fees',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingFeesPage {...props} />
      </PageWrapper>
    ),
  }
}
