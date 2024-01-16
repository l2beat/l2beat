import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { FinalityPagesData } from './types'
import { ScalingFinalityPage } from './view/ScalingFinalityPage'

export function getFinalityPage(config: Config, pagesData: FinalityPagesData) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/finality',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingFinalityPage {...props} />
      </PageWrapper>
    ),
  }
}
