import type { Project, ProjectProofSystem } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import { type ProjectId, notUndefined } from '@l2beat/shared-pure'
import uniqBy from 'lodash/uniqBy'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'

export interface ZkCatalogEntry extends CommonProjectEntry {
  name: string
  icon: string
  creator?: string
  tvs: number
  usedIn: ProjectId[]
  verifiers: {
    verified: number
    notVerified: number
  }
  attesters: ZkCatalogAttester[]
  trustedSetup: ProjectProofSystem['trustedSetup']
}

export function getZkCatalogEntries(
  projects: Project<'proofSystem' | 'display'>[],
): ZkCatalogEntry[] {
  return projects.map((project) => {
    return {
      id: project.id,
      slug: project.slug,
      statuses: {},
      name: project.name,
      icon: getProjectIcon(project.slug),
      creator: project.proofSystem.creator,
      tvs: 100000,
      usedIn: project.proofSystem.verifierHashes.flatMap((v) => v.usedBy),
      verifiers: {
        verified: project.proofSystem.verifierHashes.filter(
          (v) => v.verificationStatus === 'successful',
        ).length,
        notVerified: project.proofSystem.verifierHashes.filter(
          (v) =>
            v.verificationStatus === 'notVerified' ||
            v.verificationStatus === 'unsuccessful',
        ).length,
      },
      attesters: uniqBy(
        project.proofSystem.verifierHashes
          .flatMap((v) => v.attesters)
          .filter(notUndefined),
        (a) => a?.id,
      ),
      trustedSetup: project.proofSystem.trustedSetup,
    }
  })
}
