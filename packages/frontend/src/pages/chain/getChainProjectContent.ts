import { getChainProjectEntry } from '~/server/features/chains/getChainProjectEntry'
import type {
  ProjectPageContent,
  ProjectPageContext,
  ProjectPageDefinition,
} from '../project/projectPageDefinition'
import { renderChainProjectMarkdown } from './renderChainProjectMarkdown'

/** The page of a chain no section lists, like Solana: its interop flows. */
export const chainProjectPage: ProjectPageDefinition<'ChainProjectPage'> = {
  component: 'ChainProjectPage',
  getContent: getChainProjectContent,
  renderMarkdown: ({ entry }) => renderChainProjectMarkdown(entry),
}

async function getChainProjectContent(
  slug: string,
  { helpers }: ProjectPageContext,
): Promise<ProjectPageContent<'ChainProjectPage'> | undefined> {
  const entry = await getChainProjectEntry(slug, helpers)
  if (!entry) return undefined

  return {
    props: { entry },
    metadata: {
      name: entry.name,
      description: `Cross-chain volume and flows of ${entry.name}: the interop protocols and tokens moving value between ${entry.name} and other chains.`,
    },
  }
}
