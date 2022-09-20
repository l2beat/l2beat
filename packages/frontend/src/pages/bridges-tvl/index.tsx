import { Bridge } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'
import React from 'react'

import { PageWrapper } from '../../components'
import { BridgesTvlPage } from './BridgesTvlPage'
import { getProps } from './getProps'

export function getBridgesTvlPage(bridges: Bridge[], apiMain: ApiMain) {
  const { props, wrapper } = getProps(bridges, apiMain)
  return {
    slug: '/bridges/Tvl',
    page: (
      <PageWrapper {...wrapper}>
        <BridgesTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
