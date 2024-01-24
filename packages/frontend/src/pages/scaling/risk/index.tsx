import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { ScalingRiskPagesData } from './types'
import { ScalingRiskPage } from './view/ScalingRiskPage'

export function getRiskPage(config: Config, pagesData: ScalingRiskPagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/risk',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingRiskPage {...props} />
      </PageWrapper>
    ),
  }
}
