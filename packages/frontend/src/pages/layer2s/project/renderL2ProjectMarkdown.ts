import {
  formatActivityCount,
  formatCurrency,
  pluralize,
} from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import {
  COMPARISON_PERIOD_LABELS,
  formatPercent,
  type PercentageChangePeriod,
} from '~/utils/calculatePercentageChange'

/** The markdown alternate of the scaling project page, from the entry the HTML page renders. */
export function renderL2ProjectMarkdown(entry: ProjectL2Entry): string {
  const api = `${PRODUCTION_ORIGIN}/api/scaling`
  return renderProjectMarkdown({
    name: entry.name,
    pageUrl: `${PRODUCTION_ORIGIN}/layer2s/projects/${entry.slug}`,
    summary: {
      warnings: compact([
        entry.header.emergencyWarning,
        entry.header.redWarning?.text,
        entry.header.warning,
      ]),
      facts: getFacts(entry),
      risks: entry.rosette.self,
      description: entry.header.description,
    },
    sections: entry.sections,
    apiLinks: {
      tvs: [
        { name: 'TVS chart (JSON)', url: `${api}/tvs/${entry.slug}` },
        {
          name: 'TVS breakdown by token (JSON)',
          url: `${api}/tvs/${entry.slug}/breakdown`,
        },
      ],
      activity: [
        { name: 'Activity chart (JSON)', url: `${api}/activity/${entry.slug}` },
      ],
    },
  })
}

/** Labels follow the stats block at the top of the HTML page. */
function getFacts({ header, stageConfig, hostChainName }: ProjectL2Entry) {
  const tvs = header.tvs?.breakdown
  return compact([
    tvs && {
      label: 'Total Value Secured',
      value: `${formatUsd(tvs.total)} (${formatChange(tvs.totalChange, tvs.totalChangePeriod)}; canonically bridged ${formatUsd(tvs.canonical)}, natively minted ${formatUsd(tvs.native)}, externally bridged ${formatUsd(tvs.external)})`,
    },
    header.activity && {
      label: 'Past day UOPS',
      value: `${formatActivityCount(header.activity.lastDayUops)} (${formatChange(header.activity.uopsWeeklyChange, header.activity.uopsWeeklyChangePeriod)})`,
    },
    header.category && { label: 'Type', value: header.category },
    stageConfig.stage !== 'NotApplicable' && {
      label: 'Stage',
      value:
        stageConfig.stage === 'UnderReview'
          ? 'Under review'
          : stageConfig.stage,
    },
    { label: 'Host chain', value: hostChainName },
    header.purposes.length > 0 && {
      label: pluralize(header.purposes.length, 'Purpose'),
      value: header.purposes.join(', '),
    },
    header.chainId !== undefined && {
      label: 'Chain ID',
      value: String(header.chainId),
    },
  ])
}

function formatChange(change: number, period: PercentageChangePeriod) {
  const sign = change > 0 ? '+' : change < 0 ? '-' : ''
  return `${sign}${formatPercent(Math.abs(change))} compared to ${COMPARISON_PERIOD_LABELS[period]}`
}

/** The HTML page separates the unit with a hair space; plain text reads better with a regular one. */
function formatUsd(value: number) {
  return formatCurrency(value, 'usd').replaceAll('\u200A', ' ')
}
