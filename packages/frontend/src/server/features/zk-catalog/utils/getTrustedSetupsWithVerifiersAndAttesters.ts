import type {
  Project,
  ProjectZkCatalogInfo,
  TrustedSetup,
  ZkCatalogTag,
} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import uniqBy from 'lodash/uniqBy'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { ContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import { getProjectIcon } from '../../utils/getProjectIcon'
import type { TrustedSetupVerifierData } from '../getZkCatalogEntries'
import { calculateProjectTvs } from './getZkCatalogProjectTvs'

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
            contractUtils.getUsedIn(project.id, d.chain, d.address),
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
    attesters: verifiersForStatus
      .flatMap((v) => v.attesters)
      .filter(notUndefined)
      .map((a) => ({
        ...a,
        icon: getProjectIcon(a.id),
      })),
  }
}
