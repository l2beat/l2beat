import type {
  Project,
  ProjectZkCatalogInfo,
  TrustedSetup,
  ZkCatalogTag,
} from '@l2beat/config'
import { notUndefined, type ProjectId } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import uniqBy from 'lodash/uniqBy'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { getLogger } from '~/server/utils/logger'
import type { ContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import { getProjectIcon } from '../../utils/getProjectIcon'
import type { TrustedSetupVerifierData } from '../getZkCatalogEntries'

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
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
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

      const projectsUsedIn = uniqBy(
        trustedSetupVerifiers.flatMap((v) =>
          v.knownDeployments.flatMap((d) =>
            d.overrideUsedIn
              ? getProjectsUsedIn(d.overrideUsedIn, allProjects)
              : contractUtils.getUsedIn(project.id, d.chain, d.address),
          ),
        ),
        (u) => u.id,
      )
        .map((u) => ({
          ...u,
          tvs: calculateProjectTvs(u.id, allProjects, tvs),
        }))
        .sort((a, b) => b.tvs - a.tvs)

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
          projectsUsedIn,
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
    attesters: uniqBy(
      verifiersForStatus.flatMap((v) => v.attesters),
      (a) => a?.id,
    )
      .filter(notUndefined)
      .map((a) => ({
        ...a,
        icon: getProjectIcon(a.id),
      })),
  }
}

export function getProjectsUsedIn(
  projectIds: ProjectId[],
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
): UsedInProjectWithIcon[] {
  return projectIds
    .map((projectId) => {
      const project = allProjects.find((p) => p.id === projectId)
      if (!project) return undefined

      let url = `/scaling/projects/${project.slug}`
      if (project.isBridge) {
        url = `/bridges/projects/${project.slug}`
      } else if (project.daBridge) {
        const layer = allProjects
          .filter((x) => x.isDaLayer)
          .find((x) => x.id === project.daBridge?.daLayer)
        url = `/data-availability/projects/${layer?.slug}/${project.slug}`
      } else if (project.isDaLayer) {
        url = `/data-availability/projects/${project.slug}/no-bridge`
      }

      return {
        id: project.id,
        name: project.name,
        slug: project.slug,
        icon: getProjectIcon(project.slug),
        url,
      }
    })
    .filter(notUndefined)
}

function calculateProjectTvs(
  projectId: string,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
  tvs: SevenDayTvsBreakdown,
): number {
  const project = allProjects.find((p) => p.id === projectId)
  if (!project) {
    const logger = getLogger().for('calculateProjectTvs')
    logger.warn(`Project ${projectId} not found`)
    return 0
  }

  // if project is a DA bridge we want to get summed TVS of all projects secured by this bridge
  if (project.daBridge) {
    return project.daBridge.usedIn
      .map((p) => p.id)
      .reduce((acc, p) => {
        const projectTvs = tvs.projects[p]?.breakdown.total
        return projectTvs ? acc + projectTvs : acc
      }, 0)
  }

  return tvs.projects[project.id]?.breakdown.total ?? 0
}
