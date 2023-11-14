import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { PagesData } from '../../Page'
import { getProps } from './props/getProps'
import { ScalingLivenessPage } from './view/ScalingLivenessPage'

export function getLivenessPage(config: Config, pagesData: PagesData) {
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
