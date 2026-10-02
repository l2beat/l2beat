import type {
  PrivacyAdversary,
  PrivacyAdversaryCell,
  PrivacyExposureMap,
  PrivacyFieldInfo,
  PrivacySource,
} from '@l2beat/config'
import compact from 'lodash/compact'
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
  PRIVACY_ASSETS_BREAKDOWN_HEADERS as HEADERS,
} from '~/pages/privacy/project/components/assets-breakdown/privacyAssetsBreakdown'
import type { PrivacyBucket } from '~/server/features/privacy/types'
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

/** The promise, then one subsection per adversary with what it learns, as the HTML section shows it. */
export function renderPrivacyAdversaries(
  { adversaries }: Pick<PrivacyAdversariesSectionProps, 'adversaries'>,
  level: number,
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
  }: {
    /** The public observer cell; undefined when rendering the baseline itself. */
    baseline: PrivacyAdversaryCell | undefined
    fields: PrivacyFieldInfo[]
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
    renderSources(cell.sources ?? []),
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

function renderSources(sources: PrivacySource[]) {
  const links = sources.flatMap((source) =>
    'url' in source ? [link(source.title, source.url)] : [],
  )
  if (links.length === 0) return ''
  return joinBlocks(['**Sources**', bulletList(links)])
}

/** The breakdown table with every bucket row expanded, since markdown cannot fold them. */
export function renderPrivacyAssetsBreakdown({
  assets,
  showTvl,
}: Pick<PrivacyAssetsBreakdownSectionProps, 'assets' | 'showTvl'>) {
  const columns = getAssetsBreakdownColumns({
    showBuckets: assets.some((asset) => asset.bucketCount > 1),
    showTvl,
  })
  const rows: AssetsBreakdownRow[] = [
    ...assets.flatMap((asset) => [
      { name: asset.symbol, bucketCount: asset.bucketCount, metrics: asset },
      ...(asset.bucketCount > 1
        ? asset.buckets.map((bucket) => ({
            name: `${asset.symbol}: ${formatBucketLabel(bucket.label)}`,
            metrics: bucket,
          }))
        : []),
    ]),
    { name: 'Total', metrics: getPrivacyAssetsTotals(assets) },
  ]

  return table(
    columns.map((column) => column.header),
    rows.map((row) => columns.map((column) => column.cell(row))),
  )
}

interface AssetsBreakdownRow {
  name: string
  /** Only asset rows have one; bucket and total rows leave the cell empty, like the HTML. */
  bucketCount?: number
  metrics: Pick<
    PrivacyBucket,
    'deposits' | 'depositedValueUsd' | 'totalValueUsd'
  >
}

interface AssetsBreakdownColumn {
  header: string
  cell: (row: AssetsBreakdownRow) => string
}

/** Same visibility rules as the HTML table. */
function getAssetsBreakdownColumns(options: {
  showBuckets: boolean
  showTvl: boolean
}): AssetsBreakdownColumn[] {
  return compact([
    { header: HEADERS.asset, cell: (row) => row.name },
    options.showBuckets && {
      header: HEADERS.buckets,
      cell: (row) =>
        row.bucketCount === undefined ? '' : String(row.bucketCount),
    },
    depositsColumn(HEADERS.deposits7d, 'last7d'),
    depositsColumn(HEADERS.deposits30d, 'last30d'),
    depositsColumn(HEADERS.depositsTotal, 'total'),
    options.showTvl && {
      header: HEADERS.valueLocked,
      cell: (row) => formatValueLocked(row.metrics.totalValueUsd),
    },
  ])
}

function depositsColumn(
  header: string,
  period: keyof PrivacyBucket['deposits'],
): AssetsBreakdownColumn {
  return {
    header,
    cell: ({ metrics }) =>
      formatDeposits(
        metrics.deposits[period],
        metrics.depositedValueUsd[period],
      ),
  }
}

function formatDeposits(count: number, valueUsd: number) {
  return `${formatCount(count)} (${formatUsd(valueUsd)})`
}

function formatValueLocked(valueUsd: number | null) {
  return valueUsd === null ? '—' : formatUsd(valueUsd)
}
