import type { Project, ProjectZkCatalogInfo } from '@l2beat/config'
import type { UnixTime } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { ps } from '~/server/projects'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import {
  getUnderReviewStatus,
  type UnderReviewStatus,
} from '~/utils/project/underReview'
import { get7dTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import { getProjectIcon } from '../../utils/getProjectIcon'
import {
  getTrustedSetupsWithVerifiersAndAttesters,
  type TrustedSetupsByProofSystem,
} from '../utils/getTrustedSetupsWithVerifiersAndAttesters'
import { getZkCatalogProjectTvs } from '../utils/getZkCatalogProjectTvs'

export interface ProjectZkCatalogEntry {
  name: string
  shortName: string | undefined
  creator?: string
  slug: string
  icon: string
  archivedAt: UnixTime | undefined
  underReviewStatus: UnderReviewStatus
  header: {
    warning?: string
    redWarning?: string
    emergencyWarning?: string
    description?: string
    links: ProjectLink[]
    trustedSetupsByProofSystem: TrustedSetupsByProofSystem
    techStack: ProjectZkCatalogInfo['techStack']
    tvs: {
      value: number
      change: number
    }
  }
  sections: ProjectDetailsSection[]
}

export async function getZkCatalogProjectEntry(
  project: Project<
    'display' | 'zkCatalogInfo' | 'statuses',
    'archivedAt' | 'milestones'
  >,
): Promise<ProjectZkCatalogEntry> {
  const [allProjects, tvs] = await Promise.all([
    ps.getProjects({
      optional: ['daBridge', 'isBridge', 'isScaling', 'isDaLayer'],
    }),
    get7dTvsBreakdown({ type: 'layer2' }),
  ])

  const trustedSetupsByProofSystem = getTrustedSetupsWithVerifiersAndAttesters(
    project,
    allProjects,
  )
  const { tvs: tvsForProject, change } = getZkCatalogProjectTvs(
    project,
    allProjects,
    tvs,
  )

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
    },
  }

  const common = {
    name: project.name,
    creator: project.zkCatalogInfo.creator,
    shortName: project.shortName,
    slug: project.slug,
    icon: getProjectIcon(project.slug),
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.statuses.reviewStatus,
      impactfulChange: false,
    }),
    archivedAt: project.archivedAt,
    header,
  }

  const sections: ProjectDetailsSection[] = []

  if (project.zkCatalogInfo.proofSystemInfo) {
    sections.push({
      type: 'MarkdownSection',
      props: {
        id: 'proof-system',
        title: 'Proof System',
        content: project.zkCatalogInfo.proofSystemInfo,
      },
    })
  }

  if (project.milestones && project.milestones.length > 0) {
    sections.push({
      type: 'MilestonesAndIncidentsSection',
      props: {
        id: 'milestones-and-incidents',
        title: 'Milestones & Incidents',
        milestones: sortedMilestones,
      },
    })
  }

  return { ...common, sections }
}
