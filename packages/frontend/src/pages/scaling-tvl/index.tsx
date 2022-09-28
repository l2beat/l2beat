import { TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ScalingTvlPage } from './view/ScalingTvlPage'

export function getTvlPage(config: Config, tvlApiResponse: TvlApiResponse) {
  const { props, wrapper } = getProps(config, tvlApiResponse)
  return {
    slug: '/scaling/tvl',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
