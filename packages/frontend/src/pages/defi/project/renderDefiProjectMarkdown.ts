import compact from 'lodash/compact'
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
    pagePath: `/defi/projects/${entry.slug}`,
    summary: {
      warnings: compact([
        entry.isUnderReview && getUnderReviewText('config'),
        entry.warnings.emergency,
        entry.warnings.red?.text,
        entry.warnings.yellow,
      ]),
      facts: getFacts(entry, totalValueLockedUsd),
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

const RISK_LABELS = [
  ['minting', 'Minting'],
  ['operators', 'Operators'],
  ['backing', 'Backing'],
  ['exchangeRate', 'Oracle'],
  ['exit', 'Exit'],
  ['upgrades', 'Upgrades'],
] as const

/**
 * The stats block of the page: the TVL as the DeFi summary table shows it,
 * then, for a liquid staking protocol, the end of its chart lines and the
 * six risk dimensions of the summary table.
 */
function getFacts(
  entry: ProjectDefiEntry,
  totalValueLockedUsd: number | undefined,
) {
  const { liquidStaking } = entry
  const metrics = liquidStaking?.metrics
  return compact([
    totalValueLockedUsd !== undefined && {
      label: 'TVL',
      value: `${formatUsd(totalValueLockedUsd)} (total USD value of assets locked in the protocol)`,
    },
    entry.category && { label: 'Category', value: entry.category },
    entry.tokens.length > 0 && {
      label: 'Tokens',
      value: entry.tokens.map((token) => token.symbol).join(', '),
    },
    metrics?.yield30d && {
      label: 'Yield',
      value: `${(metrics.yield30d.value * 100).toFixed(2)}% (rate-implied, 30 days to ${metrics.yield30d.date}, net of protocol fees)`,
    },
    metrics?.exitCostDays && {
      label: 'Cost of exit',
      value: `${metrics.exitCostDays.value.toFixed(1)} days of yield (on ${metrics.exitCostDays.date}, by the cheaper of waiting or selling at the market discount)`,
    },
    ...RISK_LABELS.map(([key, label]) => {
      const risk = liquidStaking?.risks[key]
      return (
        risk && {
          label,
          value: risk.secondLine
            ? `${risk.value} (${risk.secondLine})`
            : risk.value,
          details: [risk.description],
        }
      )
    }),
  ])
}
