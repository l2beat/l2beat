import { Layer2, Layer3, ZkCatalogProject } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { ZkCatalogProjectPage } from './view/ZkCatalogProjectPage'

export function getZkCatalogProjectPages(config: Config) {
  const zkCatalogProjects = [
    ...config.zkCatalogProjects,
    ...config.layer2s.map(mapToZkCatalogProject).filter(notUndefined),
    ...config.layer3s.map(mapToZkCatalogProject).filter(notUndefined),
  ]

  return zkCatalogProjects.map((project) => {
    const { wrapper, props } = getProps(project, config)

    return {
      slug: `/zk-catalog/${project.display.slug}`,
      page: (
        <PageWrapper {...wrapper}>
          <ZkCatalogProjectPage {...props} />
        </PageWrapper>
      ),
    }
  })
}

function mapToZkCatalogProject(
  project: Layer2 | Layer3,
): ZkCatalogProject | undefined {
  if (!project.stateValidation?.proofVerification) {
    return
  }

  return {
    display: {
      slug: project.display.slug,
      name: project.display.name,
      shortName: project.display.shortName,
      // TODO: Check if this is correct
      link: project.display.links.websites[0],
    },
    proofVerification: project.stateValidation.proofVerification,
  }
}
