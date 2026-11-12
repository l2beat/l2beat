import type {
  Project,
  ProjectRedWarning,
  ProjectZkCatalogInfo,
} from '@l2beat/config'
import type { UnixTime } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { ps } from '~/server/projects'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { manifest } from '~/utils/Manifest'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getProgramHashesSection } from '~/utils/project/getProgramHashesSection'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { getTrustedSetupsSection } from '~/utils/project/getTrustedSetupsSection'
import { getVerifiersSection } from '~/utils/project/getVerifiersSection'
import {
  getUnderReviewStatus,
  type UnderReviewStatus,
} from '~/utils/project/underReview'
import { get7dTvsBreakdown } from '../../layer2s/tvs/get7dTvsBreakdown'
import {
  getTrustedSetupsWithVerifiersAndAttesters,
  type TrustedSetupsByProofSystem,
} from '../utils/getTrustedSetupsWithVerifiersAndAttesters'
import { getZkCatalogProjectTvs } from '../utils/getZkCatalogProjectTvs'
import { getZkCatalogTvsSection } from '../utils/getZkCatalogTvsSection'

export interface ProjectZkCatalogEntry {
  name: string
  shortName: string | undefined
  creator?: string
  quantumResistant?: boolean
  slug: string
  icon: string
  archivedAt: UnixTime | undefined
  underReviewStatus: UnderReviewStatus
  header: {
    warning?: string
    redWarning?: ProjectRedWarning
    emergencyWarning?: string
    description?: string
    links: ProjectLink[]
    trustedSetupsByProofSystem: TrustedSetupsByProofSystem
    techStack: ProjectZkCatalogInfo['techStack']
    tvs: {
      value: number
      change: number
      changePeriod: PercentageChangePeriod
    }
  }
  sections: ProjectDetailsSection[]
}

type Section<Type extends ProjectDetailsSection['type']> = Extract<
  ProjectDetailsSection,
  { type: Type }
>

/** The sections of a ZK Catalog project, each declared once. */
export interface ZkCatalogSections {
  tvs?: Section<'ZkCatalogTvsSection'>
  proofSystem?: Section<'MarkdownSection'>
  milestones?: Section<'MilestonesAndIncidentsSection'>
  trustedSetups: Section<'TrustedSetupSection'>
  verifiers?: Section<'VerifiersSection'>
  programHashes?: Section<'ProgramHashesSection'>
}

type ZkCatalogProject = Project<
  'display' | 'zkCatalogInfo' | 'statuses',
  'archivedAt' | 'milestones' | 'tvsInfo'
>

/** The ZK Catalog page: every section of the project, in the page's order. */
export async function getZkCatalogProjectEntry(
  project: ZkCatalogProject,
): Promise<ProjectZkCatalogEntry> {
  const { sections, ...entry } = await getZkCatalogProject(project)
  return {
    ...entry,
    sections: compact([
      sections.tvs,
      sections.proofSystem,
      sections.milestones,
      sections.trustedSetups,
      sections.verifiers,
      sections.programHashes,
    ]),
  }
}

/** For a page that lists the project's ZK Catalog sections among its own. */
export async function getZkCatalogProject(
  project: ZkCatalogProject,
): Promise<
  Omit<ProjectZkCatalogEntry, 'sections'> & { sections: ZkCatalogSections }
> {
  const [allProjects, allProjectsWithContracts, tvs, contractUtils] =
    await Promise.all([
      ps.getProjects({
        optional: ['display', 'scalingInfo', 'daBridge', 'daLayer'],
      }),
      ps.getProjects({
        select: ['contracts'],
      }),
      get7dTvsBreakdown({ type: 'all' }),
      getContractUtils(),
    ])

  const trustedSetupsByProofSystem = getTrustedSetupsWithVerifiersAndAttesters(
    project,
    contractUtils,
    tvs,
    allProjects,
  )
  const {
    tvs: tvsForProject,
    change,
    changePeriod,
  } = getZkCatalogProjectTvs(project, allProjects, tvs)

  const sortedMilestones =
    project.milestones?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ) ?? []

  const header: ProjectZkCatalogEntry['header'] = {
    description: project.display.description,
    warning: project.statuses.yellowWarning,
    redWarning: project.statuses.redWarning,
    emergencyWarning: project.statuses.emergencyWarning,
    links: getProjectLinks(project.display.links),
    trustedSetupsByProofSystem,
    techStack: project.zkCatalogInfo.techStack,
    tvs: {
      value: tvsForProject,
      change,
      changePeriod,
    },
  }

  const common = {
    name: project.name,
    creator: project.zkCatalogInfo.creator,
    quantumResistant: project.zkCatalogInfo.quantumResistant,
    shortName: project.shortName,
    slug: project.slug,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.statuses.reviewStatus,
      impactfulChange: false,
    }),
    archivedAt: project.archivedAt,
    header,
  }

  const zkCatalogTvsSection = getZkCatalogTvsSection(project, allProjects)
  const programHashesSection = await getProgramHashesSection(
    project,
    allProjectsWithContracts,
    allProjects,
    tvs,
  )

  const sections: ZkCatalogSections = {
    tvs: zkCatalogTvsSection && {
      type: 'ZkCatalogTvsSection',
      props: {
        id: 'tvs',
        title: 'Value Secured',
        ...zkCatalogTvsSection,
      },
    },
    proofSystem: project.zkCatalogInfo.proofSystemInfo
      ? {
          type: 'MarkdownSection',
          props: {
            id: 'proof-system',
            title: 'Proof System',
            content: project.zkCatalogInfo.proofSystemInfo,
          },
        }
      : undefined,
    milestones:
      project.milestones && project.milestones.length > 0
        ? {
            type: 'MilestonesAndIncidentsSection',
            props: {
              id: 'milestones-and-incidents',
              title: 'Milestones & Incidents',
              milestones: sortedMilestones,
            },
          }
        : undefined,
    trustedSetups: {
      type: 'TrustedSetupSection',
      props: {
        id: 'trusted-setups',
        title: 'Trusted Setups',
        ...getTrustedSetupsSection(project),
      },
    },
    verifiers:
      project.zkCatalogInfo.verifierHashes.length > 0
        ? {
            type: 'VerifiersSection',
            props: {
              id: 'verifiers',
              title: 'Verifier IDs',
              variant: 'zkCatalog',
              ...(await getVerifiersSection(
                project.zkCatalogInfo.verifierHashes,
                contractUtils,
                allProjects,
                tvs,
              )),
            },
          }
        : undefined,
    programHashes: programHashesSection && {
      type: 'ProgramHashesSection',
      props: {
        id: 'program-hashes',
        title: 'Program Hashes',
        ...programHashesSection,
      },
    },
  }

  return { ...common, sections }
}
