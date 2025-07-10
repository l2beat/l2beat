import type { Project, ProjectProofSystem } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import { assert, type ProjectId, notUndefined } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
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
  allProjects: Project<never, 'daBridge'>[],
  tvs: SevenDayTvsBreakdown,
): ZkCatalogEntry[] {
  return projects.map((project) => {
    const usedInVerifiers = uniq(
      project.proofSystem.verifierHashes.flatMap((v) => v.usedBy),
    )
    const projectsForTvs = uniq(
      usedInVerifiers.flatMap((vp) => {
        const project = allProjects.find((p) => p.id === vp)
        assert(project, `Project ${vp} not found`)

        // if project is a DA bridge we want to get summed TVS of all projects secured by this bridge
        if (project.daBridge) {
          return project.daBridge.usedIn.flatMap((p) => p.id)
        }
        return vp
      }),
    )

    const tvsForProject = projectsForTvs.reduce((acc, p) => {
      const projectTvs = tvs.projects[p]?.breakdown.total
      if (!projectTvs) {
        return acc
      }
      return acc + projectTvs
    }, 0)

    return {
      id: project.id,
      slug: project.slug,
      statuses: project.statuses,
      name: project.name,
      icon: getProjectIcon(project.slug),
      creator: project.proofSystem.creator,
      tvs: tvsForProject,
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
      projectsUsedIn: getProjectsUsedIn(usedInVerifiers, allProjects),
    }
  })
}

function getProjectsUsedIn(
  usedInVerifiers: ProjectId[],
  allProjects: Project[],
): UsedInProjectWithIcon[] {
  return usedInVerifiers.map((id) => {
    const project = allProjects.find((p) => p.id === id)
    assert(project, `Project ${id} not found`)

    return {
      id: id,
      name: project.name,
      slug: project.slug,
      icon: getProjectIcon(project.slug),
    }
  })
}
