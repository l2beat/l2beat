import type {
  Project,
  ProjectZkCatalogInfo,
  TrustedSetup,
  ZkCatalogTag,
} from '@l2beat/config'
import { assert, notUndefined, type ProjectId } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import uniq from 'lodash/uniq'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { getLogger } from '~/server/utils/logger'
import { getProjectIcon } from '../utils/getProjectIcon'
import type { TrustedSetupVerifierData } from './getZkCatalogEntries'

export type TrustedSetupsByProofSystem = Record<
  string,
  {
    trustedSetups: (TrustedSetup & {
      proofSystem: ZkCatalogTag
    })[]
    verifiers: {
      successful?: TrustedSetupVerifierData
      unsuccessful?: TrustedSetupVerifierData
      notVerified?: TrustedSetupVerifierData
    }
    projectsUsedIn: UsedInProjectWithIcon[]
  }
>

export function getTrustedSetupsWithVerifiersAndAttesters(
  project: Project<'zkCatalogInfo'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
): TrustedSetupsByProofSystem {
  const grouped = groupBy(
    project.zkCatalogInfo.trustedSetups,
    (e) => `${e.proofSystem.type}-${e.proofSystem.id}`,
  )
  return Object.fromEntries(
    Object.entries(grouped).map(([key, trustedSetups]) => {
      const trustedSetupVerifiers = project.zkCatalogInfo.verifierHashes.filter(
        (v) => key === `${v.proofSystem.type}-${v.proofSystem.id}`,
      )

      const groupedByStatus = groupBy(
        trustedSetupVerifiers,
        (v) => v.verificationStatus,
      )

      return [
        key,
        {
          trustedSetups,
          verifiers: {
            successful: getVerifiersWithAttesters(
              groupedByStatus,
              'successful',
            ),
            unsuccessful: getVerifiersWithAttesters(
              groupedByStatus,
              'unsuccessful',
            ),
            notVerified: getVerifiersWithAttesters(
              groupedByStatus,
              'notVerified',
            ),
          },
          projectsUsedIn: getProjectsUsedIn(
            uniq(trustedSetupVerifiers.flatMap((v) => v.usedBy)),
            allProjects,
          ),
        },
      ]
    }),
  )
}

export function getVerifiersWithAttesters(
  verifiers: Record<string, ProjectZkCatalogInfo['verifierHashes']>,
  key: 'successful' | 'unsuccessful' | 'notVerified',
): TrustedSetupVerifierData | undefined {
  const verifiersForStatus = verifiers[key]
  if (!verifiersForStatus || verifiersForStatus.length === 0) return undefined

  return {
    count: verifiersForStatus.length,
    attesters: verifiersForStatus
      .flatMap((v) => v.attesters)
      .filter(notUndefined)
      .map((a) => ({
        ...a,
        icon: getProjectIcon(a.id),
      })),
  }
}

function getProjectsUsedIn(
  usedInVerifiers: ProjectId[],
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
): UsedInProjectWithIcon[] {
  return usedInVerifiers
    .map((id) => {
      const project = allProjects.find((p) => p.id === id)
      if (!project) {
        const logger = getLogger().for('getProjectsUsedIn')
        logger.warn(`Project ${id} not found`)
        return undefined
      }

      const href = getProjectHref(project, allProjects)

      return {
        id: id,
        name: project.name,
        slug: project.slug,
        icon: getProjectIcon(project.slug),
        href,
      }
    })
    .filter((e) => e !== undefined)
}

function getProjectHref(
  project: Project<never, 'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
) {
  if (project.isBridge) return `/bridges/projects/${project.slug}`
  if (project.isScaling) return `/scaling/projects/${project.slug}`
  if (project.isDaLayer) {
    const daBridge = allProjects.find((p) => p.id === project.daBridge?.daLayer)
    assert(daBridge, `DA bridge ${project.id} not found`)

    return `/data-availability/projects/${project.slug}/${daBridge.slug}`
  }
  if (project.daBridge) {
    const daLayer = allProjects.find((p) => p.id === project.daBridge?.daLayer)
    assert(daLayer, `DA layer ${project.daBridge.daLayer} not found`)

    return `/data-availability/projects/${daLayer.slug}/${project.slug}`
  }

  throw new Error(`Unknown project type: ${project.id}`)
}
