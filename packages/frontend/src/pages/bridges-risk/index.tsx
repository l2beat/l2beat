import { TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { BridgesRiskPage } from './BridgesRiskPage'
import { getProps } from './getProps'

export function getBridgesRiskPage(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  verifiedContracts: Record<string, boolean>,
) {
  const { props, wrapper } = getProps(config, tvlApiResponse, verifiedContracts)
  return {
    slug: '/bridges/risk',
    page: (
      <PageWrapper {...wrapper}>
        <BridgesRiskPage {...props} />
      </PageWrapper>
    ),
  }
}
