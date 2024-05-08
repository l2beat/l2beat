import React from 'react'

import {} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { ZkCatalogProjectPage } from './view/ZkCatalogProjectPage'

export function getZkCatalogProjectPages(config: Config) {
  const projects = [
    ...config.zkCatalogProjects,
    ...config.layer2s,
    ...config.layer3s,
  ]

  const pages = projects
    .map((project) => {
      const projectProps = getProps(project, config)
      if (!projectProps) return
      const { props, wrapper } = projectProps

      return {
        slug: `/zk-catalog/${project.display.slug}`,
        page: (
          <PageWrapper {...wrapper}>
            <ZkCatalogProjectPage {...props} />
          </PageWrapper>
        ),
      }
    })
    .filter(notUndefined)

  return pages
}
