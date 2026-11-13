import type { ChainProjectPageEntry } from '~/server/features/chains/getChainProjectEntry'
import { getInteropSummaryFacts } from '~/server/markdown/interopMarkdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import { getProjectPath } from '~/utils/project/getProjectPath'

/**
 * The markdown alternate of a chain page, from the entry the HTML page
 * renders: the chain's last day across every interop protocol. Its flows are
 * an interactive graph, so that section points to the HTML page.
 */
export function renderChainProjectMarkdown(
  entry: ChainProjectPageEntry,
): string {
  return renderProjectMarkdown({
    name: entry.name,
    pagePath: getProjectPath(entry.slug),
    summary: {
      warnings: [],
      facts: getInteropSummaryFacts(entry.interop),
      risks: [],
      description: undefined,
    },
    sections: entry.sections,
    apiLinks: {},
  })
}
