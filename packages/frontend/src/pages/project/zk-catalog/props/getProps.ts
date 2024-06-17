import { Layer2, Layer3, ZkCatalogProject } from '@l2beat/config'

import { VerifiersApiResponse } from '@l2beat/shared-pure'
import { Config } from '../../../../build/config'
import { getCollectionEntry } from '../../../../content/getCollection'
import { getProofVerification } from '../../../../utils/zk-catalog/getProofVerification'
import { trustedSetup } from '../../../../utils/zk-catalog/trustedSetup'
import { Wrapped } from '../../../Page'
import { ZK_CATALOG_ASK_FOR_VERIFICATION_LINK } from '../../../zk-catalog/props/getZkCatalogView'
import {
  ZkCatalogProjectDetails,
  ZkCatalogProjectPageProps,
} from '../view/ZkCatalogProjectPage'

export function getProps(
  project: Layer2 | Layer3 | ZkCatalogProject,
  config: Config,
  verifiersApiResponse: VerifiersApiResponse,
): Wrapped<ZkCatalogProjectPageProps> {
  return {
    props: {
      details: getZkCatalogProjectDetails(project, verifiersApiResponse),
      askForVerificationLink: ZK_CATALOG_ASK_FOR_VERIFICATION_LINK,
    },
    wrapper: {
      metadata: {
        title: `${project.display.name} - ZK Catalog`,
        description: `${project.display.name} detailed research regarding zero-knowledge technology.`,
        image: `https://l2beat.com/meta-images/projects/${project.display.slug}.png`,
        url: `https://l2beat.com/zk-catalog/${project.display.slug}`,
      },
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

  return {
    title: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
    linkToMainProjectDetails:
      project.type === 'zk-catalog'
        ? undefined
        : `/scaling/projects/${project.display.slug}`,
    trustedSetup: trustedSetup(proofVerification.verifiers),
    description: descriptionEntry.content,
    ...proofVerification,
  }
}
