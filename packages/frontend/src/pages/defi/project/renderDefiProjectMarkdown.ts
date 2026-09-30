import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import { getUnderReviewText } from '~/utils/project/underReview'

/** The markdown alternate of the DeFi project page, from the entry the HTML page renders. */
export function renderDefiProjectMarkdown(entry: ProjectDefiEntry): string {
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
      facts: getFacts(entry),
      // DeFi pages have no risk rosette.
      risks: [],
      description: entry.description,
    },
    sections: entry.sections,
    apiLinks: {},
  })
}

/** DeFi pages have no stats block; the summary card shows only badges and About. */
function getFacts({ badges }: ProjectDefiEntry) {
  return compact([
    badges.length > 0 && {
      label: 'Badges',
      value: badges.map((badge) => badge.name).join(', '),
    },
  ])
}
