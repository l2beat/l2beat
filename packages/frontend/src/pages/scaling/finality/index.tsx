import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { PagesData } from '../../Page'
import { getProps } from './props'
import { ScalingFinalityPage } from './view/ScalingFinalityPage'

export function getFinalityPage(config: Config, pagesData: PagesData) {
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
