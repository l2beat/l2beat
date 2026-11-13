import { getChainFlowsSection } from '~/server/features/chains/getChainProjectEntry'
import type {
  ProjectPageContent,
  ProjectPageContext,
  ProjectPageDefinition,
} from '../../project/projectPageDefinition'
import { getInteropProtocolContent } from './getInteropProtocolContent'
import { renderInteropProtocolMarkdown } from './renderInteropProtocolMarkdown'

/**
 * The page of an interop protocol that is also a chain, like Avalanche. The
 * chain's flows are an interactive graph, so the markdown is the protocol's:
 * its top chains and routes, as for any other protocol.
 */
export const interopChainProtocolPage: ProjectPageDefinition<'InteropProtocolPage'> =
  {
    component: 'InteropProtocolPage',
    getContent: getInteropChainProtocolContent,
    renderMarkdown: renderInteropProtocolMarkdown,
  }

async function getInteropChainProtocolContent(
  slug: string,
  context: ProjectPageContext,
): Promise<ProjectPageContent<'InteropProtocolPage'> | undefined> {
  const [content, chainFlows] = await Promise.all([
    getInteropProtocolContent(slug, context),
    getChainFlowsSection(slug, context.helpers),
  ])
  if (!content) return undefined

  return {
    ...content,
    props: {
      ...content.props,
      // Undefined while the chain has no interop data: the page then shows
      // the protocol's own volume. Links to that section land on the flows.
      chainFlows: chainFlows && {
        ...chainFlows,
        props: { ...chainFlows.props, aliasIds: ['interop-volume'] },
      },
    },
  }
}
