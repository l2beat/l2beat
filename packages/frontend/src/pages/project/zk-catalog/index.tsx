import React from 'react'

import { VerifiersApiResponse } from '@l2beat/shared-pure'
import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { ZkCatalogProjectPage } from './view/ZkCatalogProjectPage'

export function getZkCatalogProjectPages(
  config: Config,
  verifiersApiResponse: VerifiersApiResponse,
) {
  const projects = [
    ...config.zkCatalogProjects,
    ...config.layer2s.filter((l2) => l2.stateValidation?.proofVerification),
    ...config.layer3s.filter((l3) => l3.stateValidation?.proofVerification),
  ]

  const pages = projects.map((project) => {
    const { props, wrapper } = getProps(project, config, verifiersApiResponse)

    return {
      slug: `/zk-catalog/${project.display.slug}`,
      page: (
        <PageWrapper {...wrapper}>
          <ZkCatalogProjectPage {...props} />
        </PageWrapper>
      ),
    }
  })

  return pages
}
