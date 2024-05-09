import { Layer2, Layer3, ZkCatalogProject } from '@l2beat/config'

import { assert } from '@l2beat/shared-pure'
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
): Wrapped<ZkCatalogProjectPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      details: getZkCatalogProjectDetails(project),
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
): ZkCatalogProjectDetails {
  if (project.type === 'zk-catalog') {
    return {
      title: project.display.name,
      icon: `/icons/${project.display.slug}.png`,
      linkToMainProjectDetails: undefined,
      hasTrustedSetup: hasTrustedSetup(project.proofVerification.verifiers),
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
    ...project.stateValidation.proofVerification,
  }
}

function hasTrustedSetup(verifiers: ZkCatalogProjectDetails['verifiers']) {
  return verifiers.some((verifier) =>
    verifier.subVerfiers.some((subVerifier) => !!subVerifier.trustedSetup),
  )
}
