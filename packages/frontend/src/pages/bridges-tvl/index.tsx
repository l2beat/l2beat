import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { PagesData } from '../Page'
import { BridgesTvlPage } from './BridgesTvlPage'
import { getProps } from './props'

export function getBridgesTvlPage(config: Config, pagesData: PagesData) {
  const shouldHideMultisigAnnouncement = !config.features.multisigReport

  const { props, wrapper } = getProps(config, pagesData)
  return {
    slug: '/bridges/summary',
    page: (
      <PageWrapper
        {...wrapper}
        hideAnnouncementBar={shouldHideMultisigAnnouncement}
        hideFloatingBanner={shouldHideMultisigAnnouncement}
      >
        <BridgesTvlPage {...props} />
      </PageWrapper>
    ),
  }
}
