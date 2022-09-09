import { Bridge } from '@l2beat/config'
import React from 'react'

import { PageWrapper } from '../../components'
import { BridgesRiskPage } from './BridgesRiskPage'
import { getProps } from './getProps'

export function getBridgesRiskPage(bridges: Bridge[]) {
  const { props, wrapper } = getProps(bridges)
  return {
    slug: '/bridges/risk',
    page: (
      <PageWrapper {...wrapper}>
        <BridgesRiskPage {...props} />
      </PageWrapper>
    ),
  }
}
