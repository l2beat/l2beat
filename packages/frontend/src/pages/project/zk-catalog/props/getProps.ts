import { Layer2, Layer3, ZkCatalogProject } from '@l2beat/config'

import { assert } from '@l2beat/shared-pure'
import { Config } from '../../../../build/config'
import { getCollectionEntry } from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import {
  ZkCatalogProjectDetails,
  ZkCatalogProjectPageProps,
} from '../view/ZkCatalogProjectPage'
import { getPageMetadata } from './getPageMetadata'
import { hasTrustedSetup } from './hasTrustedSetup'

export function getProps(
  project: Layer2 | Layer3 | ZkCatalogProject,
  config: Config,
): Wrapped<ZkCatalogProjectPageProps> {
  return {
    props: {
      details: getZkCatalogProjectDetails(project),
    },
    wrapper: {
      metadata: getPageMetadata(project),
      banner: config.features.banner,
    },
  }
}

function getZkCatalogProjectDetails(
  project: Layer2 | Layer3 | ZkCatalogProject,
): ZkCatalogProjectDetails {
  const descriptionEntry = getCollectionEntry(
    'zkCatalogDescriptions',
    project.display.slug,
  )

  if (project.type === 'zk-catalog') {
    return {
      title: project.display.name,
      icon: `/icons/${project.display.slug}.png`,
      linkToMainProjectDetails: undefined,
      hasTrustedSetup: hasTrustedSetup(project.proofVerification.verifiers),
      description: descriptionEntry.content,
      ...project.proofVerification,
    }
  }

  assert(project.stateValidation?.proofVerification, 'Invalid project')

  return {
    title: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
    linkToMainProjectDetails: `/scaling/projects/${project.display.slug}`,
    hasTrustedSetup: hasTrustedSetup(
      project.stateValidation.proofVerification.verifiers,
    ),
    description: descriptionEntry.content,
    ...project.stateValidation.proofVerification,
  }
}
