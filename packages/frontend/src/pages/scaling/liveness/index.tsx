import { LivenessApiResponse } from '@l2beat/shared-pure'
import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props/getProps'
import { ScalingLivenessPage } from './view/ScalingLivenessPage'

export function getLivenessPage(
  config: Config,
  livenessData: LivenessApiResponse,
) {
  const { props, wrapper } = getProps(config, livenessData)
  return {
    slug: '/scaling/liveness',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingLivenessPage {...props} />
      </PageWrapper>
    ),
  }
}
