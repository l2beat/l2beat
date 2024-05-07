import { ZkCatalogProject } from '@l2beat/config'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { ZkCatalogProjectPageProps } from '../view/ZkCatalogProjectPage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  project: ZkCatalogProject,
  config: Config,
): Wrapped<ZkCatalogProjectPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      details: {
        title: project.display.name,
        icon: `/icons/${project.display.slug}.png`,
        description: project.display.description,
        proofVerification: project.proofVerification,
      },
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(project),
      banner: config.features.banner,
    },
  }
}
