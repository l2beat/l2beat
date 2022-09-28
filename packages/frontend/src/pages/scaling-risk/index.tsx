import { TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ScalingRiskPage } from './view/ScalingRiskPage'

export function getRiskPage(config: Config, tvlResponse: TvlApiResponse) {
  const { props, wrapper } = getProps(config, tvlResponse)
  return {
    slug: '/scaling/risk',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingRiskPage {...props} />
      </PageWrapper>
    ),
  }
}
