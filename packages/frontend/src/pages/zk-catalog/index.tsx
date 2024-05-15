import React from 'react'
import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props/getProps'
import { ZkCatalogPage } from './view/ZkCatalogPage'

export function getZkCatalogPage(config: Config) {
  const { wrapper, props } = getProps(config)

  return {
    slug: '/zk-catalog',
    page: (
      <PageWrapper {...wrapper}>
        <ZkCatalogPage {...props} />
      </PageWrapper>
    ),
  }
}
