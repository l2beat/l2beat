import { UnixTime } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { formatUsd } from '~/server/markdown/markdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import { formatUtcDateTime } from '~/server/markdown/renderSectionParts'
import { getUnderReviewText } from '~/utils/project/underReview'
import {
  formatLatestValue,
  LIQUID_STAKING_METRICS,
  type LiquidStakingMetric,
} from '../liquid-staking/liquidStakingMetrics'
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

/** A daily value covers its whole UTC day, the others are as of a moment. */
function formatLatestDate(metric: LiquidStakingMetric, timestamp: number) {
  const start = UnixTime(timestamp)
  return metric.dailyBuckets
    ? `over ${formatUtcDateTime(start)} to ${formatUtcDateTime(UnixTime(start + UnixTime.DAY))}`
    : `on ${formatUtcDateTime(start)}`
}

/** The stats block of a liquid staking project page. */
function getLiquidStakingFacts(summary: ProjectDefiEntry['liquidStaking']) {
  if (!summary) return []
  return compact([
    ...LIQUID_STAKING_METRICS.map((metric) => {
      const latest = summary[metric.key]
      return (
        latest && {
          label: metric.title,
          value: `${formatLatestValue(metric, latest)} (${formatLatestDate(metric, latest.timestamp)}). ${metric.tooltip}`,
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
