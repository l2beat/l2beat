import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { DefinitionsPage } from './DefinitionsPage'
import { getProps } from './getProps'

export function getDefinitionsPage(config: Config) {
  const shouldHideMultisigAnnouncement = !config.features.multisigReport
  const { props, wrapper } = getProps(config)
  return {
    slug: '/definitions',
    page: (
      <PageWrapper
        {...wrapper}
        hideAnnouncementBar={shouldHideMultisigAnnouncement}
        hideFloatingBanner={shouldHideMultisigAnnouncement}
      >
        <DefinitionsPage {...props} />
      </PageWrapper>
    ),
  }
}
