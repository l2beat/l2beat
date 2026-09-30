import { formatActivityCount, pluralize } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import {
  formatChange,
  formatUsd,
  withSentiment,
} from '~/server/markdown/markdown'
import {
  getProjectStatusWarnings,
  type ProjectFact,
  renderProjectMarkdown,
} from '~/server/markdown/renderProjectMarkdown'
import { formatPercent } from '~/utils/calculatePercentageChange'

/** The markdown alternate of the scaling project page, from the entry the HTML page renders. */
export function renderL2ProjectMarkdown(entry: ProjectL2Entry): string {
  const api = `${PRODUCTION_ORIGIN}/api/scaling`
  return renderProjectMarkdown({
    name: entry.name,
    // Production URLs, like the canonical link: the document is meant to be
    // cited, whichever deployment rendered it.
    pageUrl: `${PRODUCTION_ORIGIN}/layer2s/projects/${entry.slug}`,
    summary: {
      // Same order as the banners on the HTML page.
      warnings: compact([
        ...getProjectStatusWarnings(entry),
        entry.header.warning,
        entry.header.redWarning?.text,
        entry.header.emergencyWarning,
      ]),
      facts: getFacts(entry),
      risks: entry.rosette.self,
      description: entry.header.description,
    },
    sections: entry.sections,
    apiLinks: {
      tvs: [
        { title: 'TVS chart (JSON)', url: `${api}/tvs/${entry.slug}` },
        {
          title: 'TVS breakdown by token (JSON)',
          url: `${api}/tvs/${entry.slug}/breakdown`,
        },
      ],
      activity: [
        {
          title: 'Activity chart (JSON)',
          url: `${api}/activity/${entry.slug}`,
        },
      ],
    },
  })
}

/** Labels and order follow the stats block at the top of the HTML page. */
function getFacts({
  header,
  stageConfig,
  hostChainName,
}: ProjectL2Entry): ProjectFact[] {
  return compact([
    header.tvs?.breakdown && {
      label: 'Total Value Secured',
      value: formatTvs(
        header.tvs.breakdown,
        header.tvs.additionalTrustAssumptionsPercentage,
      ),
      // The HTML shows these next to the TVS value and the tokens breakdown.
      warnings: compact([
        header.tvs.warning,
        ...header.tvs.tokens.warnings,
      ]).map((w) => withSentiment(w.value, w.sentiment)),
    },
    header.activity && {
      label: 'Past day UOPS',
      value: `${formatActivityCount(header.activity.lastDayUops)} (${formatChange(header.activity.uopsWeeklyChange, header.activity.uopsWeeklyChangePeriod)})`,
    },
    stageConfig.stage !== 'NotApplicable' && {
      label: 'Stage',
      value:
        stageConfig.stage === 'UnderReview'
          ? 'Under review'
          : stageConfig.stage,
    },
    header.gasTokens &&
      header.gasTokens.length > 0 && {
        label: `Gas ${pluralize(header.gasTokens.length, 'token')}`,
        value: header.gasTokens.join(', '),
      },
    header.category
      ? { label: 'Type', value: header.category }
      : header.proofSystemType && {
          label: 'Proof system',
          value: header.proofSystemType,
        },
    header.purposes.length > 0 && {
      label: pluralize(header.purposes.length, 'Purpose'),
      value: header.purposes.join(', '),
    },
    // The HTML shows it for L3s only; an agent cannot infer Ethereum from its absence.
    { label: 'Host chain', value: hostChainName },
    header.chainId !== undefined && {
      label: 'Chain ID',
      value: String(header.chainId),
    },
  ])
}

type TvsBreakdown = NonNullable<
  NonNullable<ProjectL2Entry['header']['tvs']>['breakdown']
>

function formatTvs(
  breakdown: TvsBreakdown,
  additionalTrustAssumptionsPercentage: number,
) {
  const change = formatChange(
    breakdown.totalChange,
    breakdown.totalChangePeriod,
  )
  const sources = [
    `canonically bridged ${formatUsd(breakdown.canonical)}`,
    `natively minted ${formatUsd(breakdown.native)}`,
    `externally bridged ${formatUsd(breakdown.external)}`,
  ].join(', ')
  const trust = `${formatPercent(additionalTrustAssumptionsPercentage)} ${ADDITIONAL_TRUST_ASSUMPTIONS}`
  return `${formatUsd(breakdown.total)} (${change}; ${sources}; ${trust})`
}

/** The wording of the HTML TVS tooltip, which says what the percentage is relative to. */
const ADDITIONAL_TRUST_ASSUMPTIONS =
  "with additional trust assumptions compared to the tokens involved and the Stage assigned to the project's canonical messaging bridge"
