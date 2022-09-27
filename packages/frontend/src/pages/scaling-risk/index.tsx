import { ApiMain } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ScalingRiskPage } from './view/ScalingRiskPage'

export function getRiskPage(config: Config, apiMain: ApiMain) {
  const { props, wrapper } = getProps(config, apiMain)
  return {
    slug: '/scaling/risk',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingRiskPage {...props} />
      </PageWrapper>
    ),
  }
}
