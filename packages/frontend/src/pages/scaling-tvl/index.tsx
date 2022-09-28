import { ApiMain } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { ScalingTvlPage } from './view/ScalingTvlPage'

export function getTvlPage(config: Config, apiMain: ApiMain) {
  const { props, wrapper } = getProps(config, apiMain)
  return {
    slug: '/scaling/tvl',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
