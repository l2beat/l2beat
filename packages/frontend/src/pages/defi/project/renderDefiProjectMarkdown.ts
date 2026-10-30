import { UnixTime } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { formatUsd } from '~/server/markdown/markdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import { formatUtcDateTime } from '~/server/markdown/renderSectionParts'
import { getUnderReviewText } from '~/utils/project/underReview'
import { LIQUID_STAKING_METRICS } from '../liquid-staking/liquidStakingMetrics'
import { LIQUID_STAKING_RISKS } from '../liquid-staking/liquidStakingRisks'

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
    pagePath: `/defi/projects/${entry.slug}`,
    summary: {
      warnings: compact([
        entry.isUnderReview && getUnderReviewText('config'),
        entry.warnings.emergency,
        entry.warnings.red?.text,
        entry.warnings.yellow,
      ]),
      facts: [
        ...getFacts(entry.category, totalValueLockedUsd),
        ...getLiquidStakingFacts(entry.liquidStaking),
      ],
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

/** The Value Locked chart is interactive, so the TVL is queried apart. */
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

/** The stats block of a liquid staking project page. */
function getLiquidStakingFacts(summary: ProjectDefiEntry['liquidStaking']) {
  if (!summary) return []
  return compact([
    ...LIQUID_STAKING_METRICS.map(({ key, title, tooltip, format }) => {
      const latest = summary[key]
      return (
        latest && {
          label: title,
          value: `${format(latest.value)} (on ${formatUtcDateTime(UnixTime(latest.timestamp))}). ${tooltip}`,
        }
      )
    }),
    ...LIQUID_STAKING_RISKS.map(({ key, title }) => {
      const risk = summary.risks[key]
      return {
        label: title,
        value: `${risk.value}${risk.secondLine ? ` (${risk.secondLine})` : ''}. ${risk.description}`,
      }
    }),
  ])
}
