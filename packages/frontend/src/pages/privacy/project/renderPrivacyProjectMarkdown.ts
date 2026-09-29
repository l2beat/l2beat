import type { PrivacySummaryValue, PrivacyWalkawayTest } from '@l2beat/config'
import compact from 'lodash/compact'
import type { RosetteValue } from '~/components/rosette/types'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { toPrivacyAdversariesSummary } from '~/server/features/privacy/utils/toPrivacyAdversariesSummary'
import {
  formatChange,
  formatCount,
  formatUsd,
  withSentiment,
} from '~/server/markdown/markdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import { getPrivacyAdversariesTableValue } from '../adversaries/privacyAdversaryUi'
import { PRIVACY_ASSESSMENT } from '../privacyAssessment'
import { PRIVACY_WALKAWAY_TEST_TOOLTIPS } from '../privacyWalkawayTest'
import { RELAYER_STAT_COPY } from './components/relayerStatCopy'

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
      warnings: compact([
        entry.warnings.emergency,
        entry.warnings.red?.text,
        entry.warnings.yellow,
      ]),
      facts: getFacts(entry),
      risks: getRiskProfile(entry),
      description: entry.description,
    },
    sections: entry.sections,
    apiLinks: {},
  })
}

/** Labels and the "not tracked" fallbacks follow the stats block at the top of the HTML page. */
function getFacts(entry: ProjectPrivacyEntry) {
  const { summary, hasTvl, bucketCount, assetsCount } = entry
  const hasFlowTracking = bucketCount > 0
  const relayerStat = summary.relayerStat
  return compact([
    hasTvl && {
      label: 'Total Value Locked',
      value:
        summary.totalValueLockedUsd === undefined
          ? 'No data'
          : compact([
              formatUsd(summary.totalValueLockedUsd),
              summary.totalValueLockedChange7d !== undefined &&
                `(${formatChange(summary.totalValueLockedChange7d, '7D')})`,
            ]).join(' '),
    },
    ...(hasFlowTracking
      ? [
          { label: 'Assets tracked', value: formatCount(assetsCount) },
          { label: 'Buckets tracked', value: formatCount(bucketCount) },
          {
            label: 'Deposits 7D',
            value: `${formatCount(summary.deposits.last7d)} (${formatChange(summary.deposits.change7d, 'last7d')})`,
          },
          {
            label: 'Deposits 30D',
            value: formatCount(summary.deposits.last30d),
          },
          {
            label: 'Deposits Total',
            value: formatCount(summary.deposits.total),
          },
        ]
      : [
          hasTvl || relayerStat
            ? {
                label: 'Live asset metrics',
                value:
                  'Not tracked. Onchain asset monitoring is not available for this project.',
              }
            : {
                label: 'Metrics',
                value:
                  'Not tracked. Data tracking is not available for this project.',
              },
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

/**
 * The four values of the risk profile under the stats. The HTML explains each
 * one on hover; the explanation is kept here, after the sentiment, since the
 * summary has no other place for it.
 */
function getRiskProfile(entry: ProjectPrivacyEntry): RosetteValue[] {
  const adversaries = entry.sections.find(
    (section) => section.type === 'PrivacyAdversariesSection',
  )?.props.adversaries
  return compact([
    explainedRisk('Trusted setup', entry.trustedSetup),
    explainedRisk(
      'Exit window',
      entry.exitWindow,
      describeWalkawayTest(entry.exitWindow.walkawayTest),
    ),
    adversaries && privacyRisk(toPrivacyAdversariesSummary(adversaries)),
    explainedRisk('Reproducibility', entry.reproducibility),
  ])
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

/** The promise with its overall grade, then the grade against each adversary the HTML dots stand for. */
function privacyRisk(
  adversaries: ReturnType<typeof toPrivacyAdversariesSummary>,
): RosetteValue {
  const overall = getPrivacyAdversariesTableValue(adversaries)
  const perAdversary = adversaries.cells.map(
    (cell) => `${cell.label}: ${withSentiment(cell.value, cell.sentiment)}`,
  )
  return {
    name: PRIVACY_ASSESSMENT.title,
    value: `${withSentiment(overall.value, overall.sentiment)}. ${perAdversary.join('; ')}.`,
  }
}

function describeWalkawayTest(walkawayTest: PrivacyWalkawayTest) {
  return walkawayTest.passed
    ? PRIVACY_WALKAWAY_TEST_TOOLTIPS.passed
    : `${PRIVACY_WALKAWAY_TEST_TOOLTIPS.notPassed} ${walkawayTest.reason}`
}
