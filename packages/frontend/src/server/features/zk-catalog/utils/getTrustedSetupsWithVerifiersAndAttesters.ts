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
import { manifest } from '~/utils/Manifest'
import type { ContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import type { TrustedSetupVerifierData } from '../getZkCatalogEntries'
import { getZkCatalogLogo } from '../getZkCatalogLogo'
import { tvsComparatorWithDaBridges } from './tvsComparatorWithDaBridges'

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
  projectId?: ProjectId, // target project id for which we want to get verifiers, used only in this project
): TrustedSetupsByProofSystem {
  const grouped = groupBy(
    project.zkCatalogInfo.trustedSetups,
    (e) => `${e.proofSystem.type}-${e.proofSystem.id}`,
  )
  return Object.fromEntries(
    Object.entries(grouped).map(([key, trustedSetups]) => {
      const verifiersWithUsedIn = getVerifiersWithProcessedUsedIn(
        project,
        key,
        contractUtils,
        allProjects,
      )

      // When projectId is provided, filter verifiers to only those used by this project
      const filteredVerifiers = projectId
        ? verifiersWithUsedIn.filter((v) =>
            v.usedIn.some((u) => u.id === projectId),
          )
        : verifiersWithUsedIn

      const verifiersGroupedByStatus = groupBy(
        filteredVerifiers.map((v) => v.verifier),
        (v) => v.verificationStatus,
      )

      const sortedProjectsUsedIn = uniqBy(
        filteredVerifiers.flatMap((v) => v.usedIn),
        (u) => u.id,
      ).sort(tvsComparatorWithDaBridges(allProjects, tvs))

      return [
        key,
        {
          trustedSetups,
          verifiers: {
            successful: getVerifiersWithAttesters(
              verifiersGroupedByStatus,
              'successful',
            ),
            unsuccessful: getVerifiersWithAttesters(
              verifiersGroupedByStatus,
              'unsuccessful',
            ),
            notVerified: getVerifiersWithAttesters(
              verifiersGroupedByStatus,
              'notVerified',
            ),
          },
          projectsUsedIn: sortedProjectsUsedIn,
        },
      ]
    }),
  )
}

function getVerifiersWithProcessedUsedIn(
  project: Project<'zkCatalogInfo'>,
  key: string,
  contractUtils: ContractUtils,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
) {
  return project.zkCatalogInfo.verifierHashes
    .filter((v) => key === `${v.proofSystem.type}-${v.proofSystem.id}`)
    .map((v) => ({
      verifier: v,
      usedIn: v.knownDeployments.flatMap((d) =>
        d.overrideUsedIn
          ? getProjectsUsedIn(d.overrideUsedIn, allProjects)
          : contractUtils.getUsedIn(project.id, d.chain, d.address),
      ),
    }))
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
      verifiersForStatus.flatMap((v) => v.attesters).filter(notUndefined),
      (a) => a.id,
    ).map((a) => {
      const icon = getZkCatalogLogo(a.id)
      return {
        ...a,
        icon: icon.light,
        iconDark: icon.dark,
      }
    }),
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
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        url,
      }
    })
    .filter(notUndefined)
}
