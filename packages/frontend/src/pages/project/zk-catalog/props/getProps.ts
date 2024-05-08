import { Layer2, Layer3, ZkCatalogProject } from '@l2beat/config'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import {
  ZkCatalogProjectDetails,
  ZkCatalogProjectPageProps,
} from '../view/ZkCatalogProjectPage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  project: Layer2 | Layer3 | ZkCatalogProject,
  config: Config,
): Wrapped<ZkCatalogProjectPageProps> | undefined {
  const details = getZkCatalogProjectDetails(project)
  if (!details) return

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      details,
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(project),
      banner: config.features.banner,
    },
  }
}

function getZkCatalogProjectDetails(
  project: Layer2 | Layer3 | ZkCatalogProject,
): ZkCatalogProjectDetails | undefined {
  if (project.type === 'zk-catalog') {
    return {
      title: project.display.name,
      icon: `/icons/${project.display.slug}.png`,
      proofVerification: project.proofVerification,
      linkToMainProjectDetails: undefined,
    }
  }

  if (!project.stateValidation?.proofVerification) return

  return {
    title: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
    proofVerification: project.stateValidation?.proofVerification,
    linkToMainProjectDetails: `/scaling/projects/${project.display.slug}`,
  }
}
