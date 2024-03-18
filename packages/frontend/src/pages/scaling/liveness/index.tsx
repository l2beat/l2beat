import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps, LivenessPagesData } from './props/getProps'
import { ScalingLivenessPage } from './view/ScalingLivenessPage'

export function getLivenessPage(config: Config, pagesData: LivenessPagesData) {
  const { props, wrapper } = getProps(config, pagesData)

  return {
    slug: '/scaling/liveness',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingLivenessPage {...props} />
      </PageWrapper>
    ),
  }
}
