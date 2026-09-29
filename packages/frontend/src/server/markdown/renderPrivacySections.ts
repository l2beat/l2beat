import type {
  PrivacyAdversary,
  PrivacyAdversaryCell,
  PrivacyExposureMap,
  PrivacyFieldInfo,
  PrivacySource,
} from '@l2beat/config'
import isEqual from 'lodash/isEqual'
import type { PrivacyAdversariesSectionProps } from '~/components/projects/sections/privacy/PrivacyAdversariesSection'
import type { PrivacyAssetsBreakdownSectionProps } from '~/components/projects/sections/privacy/PrivacyAssetsBreakdownSection'
import {
  getExposure,
  getExposureNote,
  PRIVACY_ADVERSARIES_TOOLTIP,
  PRIVACY_EXPOSURE_LABEL,
  PRIVACY_INTERIOR_LABEL,
} from '~/pages/privacy/adversaries/privacyAdversaryUi'
import {
  formatBucketLabel,
  getPrivacyAssetsTotals,
} from '~/pages/privacy/project/components/assets-breakdown/privacyAssetsBreakdown'
import type { PrivacyDepositedValueUsd } from '~/server/features/privacy/types'
import {
  bulletList,
  formatCount,
  formatUsd,
  heading,
  joinBlocks,
  link,
  table,
  withSentiment,
} from './markdown'
import type { SectionContext } from './renderProjectSection'

/** The promise, then one subsection per adversary with what it learns, as the HTML section shows it. */
export function renderPrivacyAdversaries(
  { adversaries }: Pick<PrivacyAdversariesSectionProps, 'adversaries'>,
  level: number,
  context: SectionContext,
) {
  const baseline = adversaries.cells.publicObserver
  return joinBlocks([
    `**What the protocol promises:** ${adversaries.promise.text}`,
    `${PRIVACY_ADVERSARIES_TOOLTIP} Fields marked at risk stay private only under the condition in their note.`,
    ...adversaries.adversaries.map((adversary) => {
      const cell = adversaries.cells[adversary.id]
      return renderAdversary(adversary, cell, level, {
        baseline: adversary.id === 'publicObserver' ? undefined : baseline,
        fields: adversaries.fields,
        pageUrl: context.pageUrl,
      })
    }),
  ])
}

function renderAdversary(
  adversary: PrivacyAdversary,
  cell: PrivacyAdversaryCell,
  level: number,
  {
    baseline,
    fields,
    pageUrl,
  }: {
    /** The public observer cell; undefined when rendering the baseline itself. */
    baseline: PrivacyAdversaryCell | undefined
    fields: PrivacyFieldInfo[]
    pageUrl: string
  },
) {
  return joinBlocks([
    heading(level, adversary.label),
    withSentiment(cell.value, cell.sentiment),
    `**Who:** ${adversary.description} Examples: ${adversary.examples}`,
    cell.exposure,
    cell.advice ? `**Advice:** ${cell.advice}` : '',
    cell.interior
      ? baseline?.interior
        ? renderInteriorDiff(cell.interior, baseline.interior, fields)
        : renderInterior(`**${PRIVACY_INTERIOR_LABEL}**`, cell.interior, fields)
      : '',
    renderSources(cell.sources ?? [], pageUrl),
  ])
}

/** Only the fields whose verdict or note differs from the public observer, like the HTML. */
function renderInteriorDiff(
  interior: PrivacyExposureMap,
  baseline: PrivacyExposureMap,
  fields: PrivacyFieldInfo[],
) {
  const changed = fields.filter(
    (field) => !isEqual(interior[field.id], baseline[field.id]),
  )
  if (changed.length === 0) {
    return `${PRIVACY_INTERIOR_LABEL}, the same as for a public observer.`
  }
  return renderInterior(
    `**${PRIVACY_INTERIOR_LABEL}, compared with a public observer**`,
    interior,
    changed,
  )
}

function renderInterior(
  lead: string,
  interior: PrivacyExposureMap,
  fields: PrivacyFieldInfo[],
) {
  return joinBlocks([
    lead,
    bulletList(
      fields.map((field) => {
        const leak = interior[field.id]
        const note = getExposureNote(leak)
        const verdict = `${field.label}: ${PRIVACY_EXPOSURE_LABEL[getExposure(leak)]}`
        return note ? `${verdict}. ${note}` : verdict
      }),
    ),
  ])
}

/** Contract and section sources point at anchors of the HTML page, so they resolve against it. */
function renderSources(sources: PrivacySource[], pageUrl: string) {
  const links = sources.flatMap((source) =>
    'url' in source
      ? [link(source.title, new URL(source.url, pageUrl).href)]
      : [],
  )
  if (links.length === 0) return ''
  return joinBlocks(['**Sources**', bulletList(links)])
}

/** The breakdown table with every bucket row expanded, since markdown cannot fold them. */
export function renderPrivacyAssetsBreakdown({
  assets,
  showTvl,
}: Pick<PrivacyAssetsBreakdownSectionProps, 'assets' | 'showTvl'>) {
  const showBuckets = assets.some((asset) => asset.bucketCount > 1)
  const row = (
    name: string,
    bucketCount: number | undefined,
    metrics: {
      deposits: { last7d: number; last30d: number; total: number }
      depositedValueUsd: PrivacyDepositedValueUsd
      totalValueUsd: number | null
    },
  ) => [
    name,
    ...(showBuckets
      ? [bucketCount === undefined ? '' : String(bucketCount)]
      : []),
    formatDeposits(metrics.deposits.last7d, metrics.depositedValueUsd.last7d),
    formatDeposits(metrics.deposits.last30d, metrics.depositedValueUsd.last30d),
    formatDeposits(metrics.deposits.total, metrics.depositedValueUsd.total),
    ...(showTvl ? [formatValueLocked(metrics.totalValueUsd)] : []),
  ]

  return table(
    [
      'Asset',
      ...(showBuckets ? ['Buckets'] : []),
      'Deposits 7D',
      'Deposits 30D',
      'Deposits Total',
      ...(showTvl ? ['Value Locked'] : []),
    ],
    [
      ...assets.flatMap((asset) => [
        row(asset.symbol, asset.bucketCount, asset),
        ...(asset.bucketCount > 1
          ? asset.buckets.map((bucket) =>
              row(
                `${asset.symbol}: ${formatBucketLabel(bucket.label)}`,
                undefined,
                bucket,
              ),
            )
          : []),
      ]),
      row('Total', undefined, getPrivacyAssetsTotals(assets)),
    ],
  )
}

function formatDeposits(count: number, valueUsd: number) {
  return `${formatCount(count)} (${formatUsd(valueUsd)})`
}

function formatValueLocked(valueUsd: number | null) {
  return valueUsd === null ? '—' : formatUsd(valueUsd)
}
