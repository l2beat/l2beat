import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { withRegularSpaces } from '~/server/markdown/markdown'
import {
  getProjectStatusWarnings,
  renderProjectMarkdown,
} from '~/server/markdown/renderProjectMarkdown'
import { ETHEREUM_PROJECT_PATH } from './paths'
import { getEthereumProjectStats } from './utils/getEthereumProjectStats'

/**
 * The markdown alternate of the page, from the entry the HTML page renders.
 * Mirrors EthereumProjectSummary: the enshrined bridge is explained instead of rated.
 */
export function renderEthereumProjectMarkdown(
  entry: EthereumProjectPageEntry,
): string {
  const { header } = entry
  return renderProjectMarkdown({
    name: entry.name,
    sections: entry.sections,
    pagePath: ETHEREUM_PROJECT_PATH,
    summary: {
      warnings: getProjectStatusWarnings({
        underReviewStatus: entry.isUnderReview ? 'config' : undefined,
      }),
      facts: [
        // Tooltips become parentheticals.
        ...getEthereumProjectStats(entry).map(({ title, value, tooltip }) => ({
          label: title,
          value: withRegularSpaces(tooltip ? `${value} (${tooltip})` : value),
        })),
        { label: 'DA Bridge', value: header.bridgeName },
        ...(header.usedIn.length > 0
          ? [
              {
                label: 'Used by',
                value: header.usedIn.map((project) => project.name).join(', '),
              },
            ]
          : []),
      ],
      risks: [],
      description: `**${header.callout.title}:** ${header.callout.description}`,
    },
    header: { links: header.links },
    apiLinks: {
      activity: [
        {
          title: 'Activity chart (JSON)',
          url: `/api/scaling/activity/${entry.slug}`,
        },
      ],
    },
  })
}
