import { getChainProjectEntry } from '~/server/features/chains/getChainProjectEntry'
import type { ProjectPage } from '~/server/features/projects/getProjectPage'
import type {
  ProjectPageContent,
  ProjectPageContext,
} from '../project/getProjectData'

export async function getChainProjectContent(
  page: ProjectPage,
  { helpers }: ProjectPageContext,
): Promise<ProjectPageContent<'ChainProjectPage'> | undefined> {
  const entry = await getChainProjectEntry(page.slug, helpers)
  if (!entry) return undefined

  return {
    props: { entry },
    metadata: {
      name: entry.name,
      description: `Cross-chain volume and flows of ${entry.name}: the interop protocols and tokens moving value between ${entry.name} and other chains.`,
    },
  }
}
