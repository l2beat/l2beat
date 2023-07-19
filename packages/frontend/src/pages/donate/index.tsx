import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { DonatePage } from './DonatePage'
import { getProps } from './getProps'

export async function getDonatePage(config: Config) {
  const shouldHideMultisigAnnouncement = !config.features.multisigReport

  const { wrapper, props } = await getProps(config)
  return {
    slug: '/donate',
    page: (
      <PageWrapper
        {...wrapper}
        hideAnnouncementBar={shouldHideMultisigAnnouncement}
        hideFloatingBanner={shouldHideMultisigAnnouncement}
      >
        <DonatePage {...props} />
      </PageWrapper>
    ),
  }
}
