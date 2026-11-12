import { getL2ProjectEntry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacySummary } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import type { ProjectPage } from '~/server/features/projects/getProjectPage'
import { ps } from '~/server/projects'
import { getScalingMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type {
  ProjectPageContent,
  ProjectPageContext,
} from '../../project/getProjectData'
import { getL2ProjectStructuredData } from './getL2ProjectStructuredData'

export async function getL2ProjectContent(
  page: ProjectPage,
  { helpers }: ProjectPageContext,
): Promise<ProjectPageContent<'L2ProjectPage'> | undefined> {
  // A scaling project that is also a privacy protocol.
  const privacy = page.sections.includes('privacy')
    ? await getPrivacyProjectDetails(page.slug)
    : undefined
  const project = await ps.getProject({
    slug: page.slug,
    select: [
      'display',
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'scalingStage',
      'scalingTechnology',
      'tvsInfo',
    ],
    optional: [
      'contracts',
      'permissions',
      'chainConfig',
      'scalingDa',
      'livenessInfo',
      'livenessConfig',
      'customDa',
      'archivedAt',
      'milestones',
      'upgradesAndGovernance',
      'trackedTxsConfig',
      'tvsConfig',
      'discoveryInfo',
      'discoveryUpdates',
      'daTrackingConfig',
      'costsInfo',
      'activityConfig',
      'garden',
      'ossificationHistory',
    ],
  })
  if (!project) return undefined
  const projectEntry = await getL2ProjectEntry(project, helpers, privacy)

  return {
    props: { projectEntry, privacy: privacy && getPrivacySummary(privacy) },
    metadata: {
      name: project.name,
      description: getScalingMetadataDescription({
        name: project.name,
        category: project.scalingInfo.type,
        stage: projectEntry.stageConfig.stage,
        hostChain: projectEntry.header.hostChain,
        tvs: projectEntry.header.tvs?.breakdown?.total,
        description: project.display.description,
      }),
      structuredData: (page) => [
        getL2ProjectStructuredData(page, {
          name: project.name,
          slug: project.slug,
          archivedAt: project.archivedAt,
          hasTvsApi: project.tvsConfig !== undefined,
          hasActivityApi: project.activityConfig !== undefined,
        }),
      ],
    },
  }
}
