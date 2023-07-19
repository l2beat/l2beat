import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { PagesData } from '../Page'
import { BridgesRiskPage } from './BridgesRiskPage'
import { getProps } from './getProps'

export function getBridgesRiskPage(config: Config, pagesData: PagesData) {
  const shouldHideMultisigAnnouncement = !config.features.multisigReport

  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/bridges/risk',
    page: (
      <PageWrapper
        {...wrapper}
        hideAnnouncementBar={shouldHideMultisigAnnouncement}
        hideFloatingBanner={shouldHideMultisigAnnouncement}
      >
        <BridgesRiskPage {...props} />
      </PageWrapper>
    ),
  }
}
