import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { DataAvailabilityPagesData } from './types'
import { ScalingDataAvailabilityPage } from './view/ScalingDataAvailabilityPage'

export function getScalingDataAvailabilityPage(
  config: Config,
  pagesData: DataAvailabilityPagesData,
) {
  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/data-availability',
    page: (
      <PageWrapper {...wrapper}>
        <ScalingDataAvailabilityPage {...props} />
      </PageWrapper>
    ),
  }
}
