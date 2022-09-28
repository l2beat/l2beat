import { TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { BridgesTvlPage } from './BridgesTvlPage'
import { getProps } from './props'

export function getBridgesTvlPage(
  config: Config,
  tvlApiResponse: TvlApiResponse,
) {
  const { props, wrapper } = getProps(config, tvlApiResponse)
  return {
    slug: '/bridges/tvl',
    page: (
      <PageWrapper {...wrapper}>
        <BridgesTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
