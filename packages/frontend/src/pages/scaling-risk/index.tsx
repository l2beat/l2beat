import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { PagesData } from '../Page'
import { getProps } from './props'
import { ScalingRiskPage } from './view/ScalingRiskPage'

export function getRiskPage(config: Config, pagesData: PagesData) {
  const shouldHideMultisigAnnouncement = !config.features.multisigReport

  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/scaling/risk',
    page: (
      <PageWrapper
        {...wrapper}
        hideAnnouncementBar={shouldHideMultisigAnnouncement}
        hideFloatingBanner={shouldHideMultisigAnnouncement}
      >
        <ScalingRiskPage {...props} />
      </PageWrapper>
    ),
  }
}
