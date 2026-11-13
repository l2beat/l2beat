import { ProjectId } from '@l2beat/shared-pure'
import { getEthereumProjectEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import type { ProjectPage } from '~/server/features/projects/getProjectPage'
import { ps } from '~/server/projects'
import { getDaMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type {
  ProjectPageContent,
  ProjectPageContext,
} from '../project/getProjectData'

export async function getEthereumProjectContent(
  _: ProjectPage,
  { helpers }: ProjectPageContext,
): Promise<ProjectPageContent<'EthereumProjectPage'>> {
  const project = await ps.getProject({
    id: ProjectId.ETHEREUM,
    select: ['daLayer', 'daBridge', 'display', 'statuses'],
    optional: ['milestones', 'contracts', 'permissions'],
  })
  if (!project) {
    throw new Error('Ethereum project not found')
  }
  const entry = await getEthereumProjectEntry(project, helpers)

  return {
    props: { entry },
    metadata: {
      name: entry.name,
      description: getDaMetadataDescription({
        name: entry.name,
        tvs: entry.header.tvs,
        economicSecurity: entry.header.economicSecurity,
        description: entry.description,
      }),
    },
  }
}
