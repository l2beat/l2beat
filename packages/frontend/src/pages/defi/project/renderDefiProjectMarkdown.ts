import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { formatUsd } from '~/server/markdown/markdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import { getUnderReviewText } from '~/utils/project/underReview'

/**
 * The markdown alternate of the DeFi project page, from the entry the HTML
 * page renders plus the TVL, which that page only charts in the browser.
 */
export function renderDefiProjectMarkdown(
  entry: ProjectDefiEntry,
  totalValueLockedUsd: number | undefined,
): string {
  return renderProjectMarkdown({
    name: entry.name,
    // Production URLs, like the canonical link: the document is meant to be
    // cited, whichever deployment rendered it.
    pageUrl: `${PRODUCTION_ORIGIN}/defi/projects/${entry.slug}`,
    summary: {
      warnings: compact([
        entry.isUnderReview && getUnderReviewText('config'),
        entry.warnings.emergency,
        entry.warnings.red?.text,
        entry.warnings.yellow,
      ]),
      facts: getFacts(entry.category, totalValueLockedUsd),
      // DeFi pages have no risk rosette.
      risks: [],
      description: entry.description,
    },
    header: {
      links: entry.projectLinks,
      badges: entry.badges,
      discoUiHref: entry.discoveryHref,
    },
    sections: entry.sections,
    apiLinks: {},
  })
}

/**
 * The project page has no stats block and its Value Locked chart is
 * interactive, so the headline numbers come from the DeFi summary table.
 */
function getFacts(
  category: ProjectDefiEntry['category'],
  totalValueLockedUsd: number | undefined,
) {
  return compact([
    totalValueLockedUsd !== undefined && {
      label: 'TVL',
      value: `${formatUsd(totalValueLockedUsd)} (total USD value of assets locked in the protocol)`,
    },
    category && { label: 'Category', value: category },
  ])
}
