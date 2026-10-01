import type { PrivacySummaryValue, PrivacyWalkawayTest } from '@l2beat/config'
import compact from 'lodash/compact'
import type { RosetteValue } from '~/components/rosette/types'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { getPrivacyAdversariesSummary } from '~/server/features/privacy/utils/toPrivacyAdversariesSummary'
import {
  formatChange,
  formatCount,
  formatUsd,
  withSentiment,
} from '~/server/markdown/markdown'
import {
  getProjectStatusWarnings,
  renderProjectMarkdown,
} from '~/server/markdown/renderProjectMarkdown'
import { PRIVACY_ASSESSMENT } from '../privacyAssessment'
import { PRIVACY_WALKAWAY_TEST_TOOLTIPS } from '../privacyWalkawayTest'
import {
  PRIVACY_PROJECT_STATS_COPY as COPY,
  RELAYER_STAT_COPY,
} from './components/privacyProjectStatsCopy'

/** The markdown alternate of the privacy project page, from the entry the HTML page renders. */
export function renderPrivacyProjectMarkdown(
  entry: ProjectPrivacyEntry,
): string {
  return renderProjectMarkdown({
    name: entry.name,
    // Production URLs, like the canonical link: the document is meant to be
    // cited, whichever deployment rendered it.
    pageUrl: `${PRODUCTION_ORIGIN}/privacy/projects/${entry.slug}`,
    summary: {
      warnings: [
        ...getProjectStatusWarnings({
          underReviewStatus: entry.isUnderReview ? 'config' : undefined,
        }),
        ...compact([
          entry.warnings.emergency,
          entry.warnings.red?.text,
          entry.warnings.yellow,
        ]),
      ],
      facts: getFacts(entry),
      risks: getRiskProfile(entry),
      description: entry.description,
    },
    sections: entry.sections,
    apiLinks: {},
  })
}

/** The stats block at the top of the HTML page, with its copy and its fallbacks. */
function getFacts(entry: ProjectPrivacyEntry) {
  const { summary, hasTvl, bucketCount, assetsCount } = entry
  const hasFlowTracking = bucketCount > 0
  const relayerStat = summary.relayerStat
  return compact([
    // Without flow tracking the HTML leaves the stat out instead of showing N/A.
    (hasTvl || hasFlowTracking) && {
      label: COPY.totalValueLocked,
      value: formatTotalValueLocked(entry),
    },
    ...(hasFlowTracking
      ? [
          { label: COPY.assetsTracked, value: formatCount(assetsCount) },
          { label: COPY.bucketsTracked, value: formatCount(bucketCount) },
          {
            label: COPY.deposits7d,
            value: `${formatCount(summary.deposits.last7d)} (${formatChange(summary.deposits.change7d, 'last7d')})`,
          },
          {
            label: COPY.deposits30d,
            value: formatCount(summary.deposits.last30d),
          },
          {
            label: COPY.depositsTotal,
            value: formatCount(summary.deposits.total),
          },
        ]
      : [
          notTrackedFact(
            hasTvl || relayerStat
              ? COPY.untrackedAssetMetrics
              : COPY.untrackedMetrics,
          ),
        ]),
    relayerStat && {
      label: RELAYER_STAT_COPY[relayerStat.kind].title,
      value: formatCount(relayerStat.value),
    },
    entry.trackedOn.length > 0 && {
      label: 'Tracked on',
      value: entry.trackedOn.map((chain) => chain.name).join(', '),
    },
    entry.attributes.length > 0 && {
      label: 'Attributes',
      value: entry.attributes.map((attribute) => attribute.label).join(', '),
    },
  ])
}

/** The text of the badges the HTML shows in place of the value. */
function formatTotalValueLocked({ summary, hasTvl }: ProjectPrivacyEntry) {
  if (!hasTvl) return 'N/A'
  if (summary.totalValueLockedUsd === undefined) return 'No data'
  return compact([
    formatUsd(summary.totalValueLockedUsd),
    summary.totalValueLockedChange7d !== undefined &&
      `(${formatChange(summary.totalValueLockedChange7d, '7D')})`,
  ]).join(' ')
}

function notTrackedFact(copy: { title: string; description: string }) {
  return {
    label: copy.title,
    value: `${COPY.notTracked}. ${copy.description}`,
  }
}

/**
 * The four values of the risk profile under the stats. The HTML explains each
 * one on hover; the explanation is kept here, after the sentiment, since the
 * summary has no other place for it.
 */
function getRiskProfile(entry: ProjectPrivacyEntry): RosetteValue[] {
  return [
    privacyRisk(getPrivacyAdversariesSummary(entry.sections)),
    explainedRisk('Trusted setup', entry.trustedSetup),
    explainedRisk(
      'Exit window',
      entry.exitWindow,
      describeWalkawayTest(entry.exitWindow.walkawayTest),
    ),
    explainedRisk('Reproducibility', entry.reproducibility),
  ]
}

function explainedRisk(
  name: string,
  risk: PrivacySummaryValue,
  ...explanations: string[]
): RosetteValue {
  return {
    name,
    value: [
      `${withSentiment(risk.value, risk.sentiment)}.`,
      risk.description,
      ...explanations,
    ].join(' '),
  }
}

/**
 * The promise, then the grade against each adversary, one per slice of the
 * HTML rosette. No overall grade: the page gives none, only the summary table
 * sorts by one.
 */
function privacyRisk(adversaries: PrivacyAdversariesSummary): RosetteValue {
  const perAdversary = adversaries.cells.map(
    (cell) => `${cell.label}: ${withSentiment(cell.value, cell.sentiment)}`,
  )
  return {
    name: PRIVACY_ASSESSMENT.title,
    value: `${adversaries.promiseLabel}. ${perAdversary.join('; ')}.`,
  }
}

function describeWalkawayTest(walkawayTest: PrivacyWalkawayTest) {
  return walkawayTest.passed
    ? PRIVACY_WALKAWAY_TEST_TOOLTIPS.passed
    : `${PRIVACY_WALKAWAY_TEST_TOOLTIPS.notPassed} ${walkawayTest.reason}`
}
