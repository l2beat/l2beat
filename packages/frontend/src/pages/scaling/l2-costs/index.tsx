import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { L2CostsPagesData } from './types'
import { ScalingL2CostsPage } from './view/ScalingL2CostsPage'

export function getL2CostsPage(config: Config, pagesData: L2CostsPagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/l2-costs',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingL2CostsPage {...props} />
      </PageWrapper>
    ),
  }
}
