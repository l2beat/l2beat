import { TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { BridgesTvlPage } from './BridgesTvlPage'
import { getProps } from './props'

export function getBridgesTvlPage(config: Config, tvlResponse: TvlApiResponse) {
  const { props, wrapper } = getProps(config, tvlResponse)
  return {
    slug: '/bridges/tvl',
    page: (
      <PageWrapper {...wrapper}>
        <BridgesTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
