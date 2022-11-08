import React from 'react'

import { Config } from '../../build/config'
import { PagesData } from '../../build/types'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ScalingRiskPage } from './view/ScalingRiskPage'

export function getRiskPage(config: Config, pagesData: PagesData) {
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
