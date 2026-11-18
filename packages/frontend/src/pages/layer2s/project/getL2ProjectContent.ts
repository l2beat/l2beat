import { getL2ProjectEntry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import { ps } from '~/server/projects'
import { getScalingMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type {
  ProjectPageContent,
  ProjectPageContext,
  ProjectPageDefinition,
} from '../../project/projectPageDefinition'
import { getL2ProjectStructuredData } from './getL2ProjectStructuredData'
import { renderL2ProjectMarkdown } from './renderL2ProjectMarkdown'

export const l2ProjectPage: ProjectPageDefinition<'L2ProjectPage'> = {
  component: 'L2ProjectPage',
  getContent: getL2ProjectContent,
  renderMarkdown: ({ projectEntry }) => renderL2ProjectMarkdown(projectEntry),
}

export async function getL2ProjectContent(
  slug: string,
  { helpers }: ProjectPageContext,
): Promise<ProjectPageContent<'L2ProjectPage'> | undefined> {
  const project = await ps.getProject({
    slug,
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
  const projectEntry = await getL2ProjectEntry(project, helpers)

  return {
    props: { projectEntry },
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
      structuredData: (webPage) => [
        getL2ProjectStructuredData(webPage, {
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
