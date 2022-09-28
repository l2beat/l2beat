import { TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ScalingTvlPage } from './view/ScalingTvlPage'

export function getTvlPage(config: Config, tvlResponse: TvlApiResponse) {
  const { props, wrapper } = getProps(config, tvlResponse)
  return {
    slug: '/scaling/tvl',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
