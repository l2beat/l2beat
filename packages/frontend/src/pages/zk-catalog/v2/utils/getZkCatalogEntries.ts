import type { Project, ProjectProofSystem } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import { assert, notUndefined } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'

export interface ZkCatalogEntry extends CommonProjectEntry {
  name: string
  icon: string
  creator?: string
  tvs: number
  projectsUsedIn: UsedInProjectWithIcon[]
  verifiers: {
    successfulCount: number
    unsuccessfulCount: number
    notVerifiedCount: number
  }
  attesters: ZkCatalogAttester[]
  trustedSetup: ProjectProofSystem['trustedSetup']
}

export function getZkCatalogEntries(
  projects: Project<'proofSystem' | 'display' | 'statuses'>[],
  allProjects: Project[],
): ZkCatalogEntry[] {
  return projects.map((project) => {
    return {
      id: project.id,
      slug: project.slug,
      statuses: project.statuses,
      name: project.name,
      icon: getProjectIcon(project.slug),
      creator: project.proofSystem.creator,
      tvs: 100000,
      verifiers: {
        successfulCount: project.proofSystem.verifierHashes.filter(
          (v) => v.verificationStatus === 'successful',
        ).length,
        unsuccessfulCount: project.proofSystem.verifierHashes.filter(
          (v) => v.verificationStatus === 'unsuccessful',
        ).length,
        notVerifiedCount: project.proofSystem.verifierHashes.filter(
          (v) => v.verificationStatus === 'notVerified',
        ).length,
      },
      attesters: uniqBy(
        project.proofSystem.verifierHashes
          .flatMap((v) => v.attesters)
          .filter(notUndefined),
        (a) => a?.id,
      ),
      trustedSetup: project.proofSystem.trustedSetup,
      projectsUsedIn: getProjectsUsedIn(project, allProjects),
    }
  })
}

function getProjectsUsedIn(
  project: Project<'proofSystem' | 'display' | 'statuses'>,
  allProjects: Project[],
) {
  return uniq(project.proofSystem.verifierHashes.flatMap((v) => v.usedBy)).map(
    (id) => {
      const project = allProjects.find((p) => p.id === id)
      assert(project, `Project ${id} not found`)

      return {
        id: id,
        name: project.name,
        slug: project.slug,
        icon: getProjectIcon(project.slug),
      }
    },
  )
}
