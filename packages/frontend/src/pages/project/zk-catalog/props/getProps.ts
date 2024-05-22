import { Layer2, Layer3, ZkCatalogProject } from '@l2beat/config'

import { VerifiersApiResponse } from '@l2beat/shared-pure'
import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getCollectionEntry } from '../../../../content/getCollection'
import { getProofVerification } from '../../../../utils/zk-catalog/getProofVerification'
import { hasTrustedSetup } from '../../../../utils/zk-catalog/hasTrustedSetup'
import { Wrapped } from '../../../Page'
import {
  ZkCatalogProjectDetails,
  ZkCatalogProjectPageProps,
} from '../view/ZkCatalogProjectPage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  project: Layer2 | Layer3 | ZkCatalogProject,
  config: Config,
  verifiersApiResponse: VerifiersApiResponse,
): Wrapped<ZkCatalogProjectPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'zk-catalog'),
      details: getZkCatalogProjectDetails(project, verifiersApiResponse),
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
  verifiersApiResponse: VerifiersApiResponse,
): ZkCatalogProjectDetails {
  const descriptionEntry = getCollectionEntry(
    'zkCatalogDescriptions',
    project.display.slug,
  )

  const proofVerification = getProofVerification(project, verifiersApiResponse)

  const baseDetails = {
    title: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
    linkToMainProjectDetails: undefined,
    hasTrustedSetup: hasTrustedSetup(proofVerification.verifiers),
    description: descriptionEntry.content,
    ...proofVerification,
  }

  if (project.type === 'zk-catalog') {
    return baseDetails
  }

  return {
    ...baseDetails,
    linkToMainProjectDetails: `/scaling/projects/${project.display.slug}`,
  }
}
