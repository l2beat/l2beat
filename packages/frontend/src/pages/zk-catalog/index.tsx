import { VerifiersApiResponse } from '@l2beat/shared-pure'
import React from 'react'
import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props/getProps'
import { ZkCatalogPage } from './view/ZkCatalogPage'

export function getZkCatalogPage(
  config: Config,
  verifiersApiResponse: VerifiersApiResponse,
) {
  const { wrapper, props } = getProps(config, verifiersApiResponse)

  return {
    slug: '/zk-catalog',
    page: (
      <PageWrapper {...wrapper} bodyClassName="min-h-screen flex flex-col">
        <ZkCatalogPage {...props} />
      </PageWrapper>
    ),
  }
}
