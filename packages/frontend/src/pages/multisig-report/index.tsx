import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props'
import { MultisigReportPage } from './view/MultisigReportPage'

export function getMultisigReportDownloadPage(config: Config) {
  const { props, wrapper } = getProps(config)

  return {
    slug: '/multisig-report',
    page: (
      <PageWrapper {...wrapper}>
        <MultisigReportPage {...props} />
      </PageWrapper>
    ),
  }
}
