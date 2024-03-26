import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { CostsPagesData } from './types'
import { ScalingCostsPage } from './view/ScalingCostsPage'

export function getCostsPage(config: Config, pagesData: CostsPagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/costs',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingCostsPage {...props} />
      </PageWrapper>
    ),
  }
}
