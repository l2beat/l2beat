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
import type { PrivacyAdviceSectionProps } from '~/components/projects/sections/privacy/PrivacyAdviceSection'
import type { PrivacyAssetsBreakdownSectionProps } from '~/components/projects/sections/privacy/PrivacyAssetsBreakdownSection'
import {
  getExposure,
  getExposureNote,
  getPrivacyAdversaryDescription,
  PRIVACY_ADVERSARIES_TOOLTIP,
  PRIVACY_EXPOSURE_LABEL,
  PRIVACY_INTERIOR_LABEL,
} from '~/pages/privacy/adversaries/privacyAdversaryUi'
import {
  ADVICE,
  getStepAdversaries,
  getStepsAgainst,
  getUncoveredAdversaries,
  getWaitInstruction,
} from '~/pages/privacy/adviceUi'
import {
  formatBucketLabel,
  getPrivacyAssetsTotals,
  PRIVACY_ASSETS_BREAKDOWN_HEADERS as HEADERS,
} from '~/pages/privacy/project/components/assets-breakdown/privacyAssetsBreakdown'
import {
  getCheckedAppSourceLabel,
  getReferenceAppDelivery,
  getReferenceAppSince,
  getReferenceAppSource,
  REFERENCE_APP,
} from '~/pages/privacy/referenceAppUi'
import type { PrivacyBucket } from '~/server/features/privacy/types'
import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import {
  bulletList,
  formatCount,
  formatUsd,
  heading,
  joinBlocks,
  link,
  numberedList,
  table,
  withSentiment,
} from './markdown'

/** The promise, then one subsection per adversary with what it learns, as the HTML section shows it. */
export function renderPrivacyAdversaries(
  {
    adversaries,
    referenceApp,
  }: Pick<PrivacyAdversariesSectionProps, 'adversaries' | 'referenceApp'>,
  level: number,
) {
  const baseline = adversaries.cells.publicObserver
  return joinBlocks([
    `**What the protocol promises:** ${adversaries.promise.text}`,
    referenceApp ? renderReferenceApps(referenceApp) : '',
    `${PRIVACY_ADVERSARIES_TOOLTIP} Fields marked at risk stay private only under the condition in their note.`,
    adversaries.advice
      ? `**${ADVICE.label}:** ${ADVICE.title}, the next section.`
      : '',
    ...adversaries.adversaries.map((adversary) => {
      const cell = adversaries.cells[adversary.id]
      return renderAdversary(adversary, cell, level, {
        baseline: adversary.id === 'publicObserver' ? undefined : baseline,
        fields: adversaries.fields,
        steps: getStepsAgainst(adversaries.advice, adversary.id),
      })
    }),
  ])
}

/** The reference app first, then the other apps checked against it, like the HTML. */
function renderReferenceApps(app: PrivacyReferenceApp) {
  const source = getReferenceAppSource(app)
  const version = app.version ? ` v${app.version}` : ''
  const meta = [
    getReferenceAppSince(app),
    source.commit
      ? `${source.label} ${link(source.commit.label, source.commit.href)}`
      : source.label,
  ]
  const delivery = getReferenceAppDelivery(app)
  const check =
    delivery.check &&
    (delivery.check.value
      ? `${delivery.check.label}: ${delivery.check.value}`
      : delivery.check.label)
  const deliveryMeta = [
    `${REFERENCE_APP.deliveryLabel}: ${delivery.label}. ${delivery.description}`,
    delivery.rebuild && link(REFERENCE_APP.rebuildLink, delivery.rebuild),
    check,
  ]
  return joinBlocks([
    `**${REFERENCE_APP.listTitle}**`,
    bulletList([
      `**${link(app.name, app.url)}**${version} (${REFERENCE_APP.referenceChip}): ${joinMeta([...meta, ...deliveryMeta])}`,
      ...app.checkedApps.map((checkedApp) => {
        const meta = [
          checkedApp.fix && `${REFERENCE_APP.fixLabel}: ${checkedApp.fix}`,
          link(getCheckedAppSourceLabel(checkedApp), checkedApp.source),
        ]
        return `**${checkedApp.name}** (${REFERENCE_APP.checkedChip}): ${checkedApp.finding} ${joinMeta(meta)}`
      }),
    ]),
    link(REFERENCE_APP.methodologyLink, REFERENCE_APP.methodologyHref),
  ])
}

/** Secondary details separated by dots, like the HTML's grey line. */
function joinMeta(parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(' · ')
}

function renderAdversary(
  adversary: PrivacyAdversary,
  cell: PrivacyAdversaryCell,
  level: number,
  {
    baseline,
    fields,
    steps,
  }: {
    /** The public observer cell; undefined when rendering the baseline itself. */
    baseline: PrivacyAdversaryCell | undefined
    fields: PrivacyFieldInfo[]
    /** The advice steps that defend this cell. */
    steps: ReturnType<typeof getStepsAgainst>
  },
) {
  return joinBlocks([
    heading(level, adversary.label),
    withSentiment(cell.value, cell.sentiment),
    `**Who:** ${adversary.description} Examples: ${adversary.examples}`,
    getPrivacyAdversaryDescription(cell),
    cell.interior
      ? baseline?.interior
        ? renderInteriorDiff(cell.interior, baseline.interior, fields)
        : renderInterior(`**${PRIVACY_INTERIOR_LABEL}**`, cell.interior, fields)
      : '',
    steps.length > 0
      ? `**${ADVICE.label}:** ${steps.map(({ step, index }) => `step ${index + 1} (${step.name})`).join(', ')}.`
      : '',
    renderSources(cell.sources ?? []),
  ])
}

/** The steps in order, each with the adversaries it defends, like the HTML. */
export function renderPrivacyAdvice({
  steps,
  adversaries,
  sentiments,
  waitWindowDays,
}: Pick<
  PrivacyAdviceSectionProps,
  'steps' | 'adversaries' | 'sentiments' | 'waitWindowDays'
>) {
  const uncovered = getUncoveredAdversaries(steps, adversaries, sentiments)
  return joinBlocks([
    `${ADVICE.intro} ${link(ADVICE.methodologyLink, ADVICE.methodologyHref)}`,
    numberedList(
      steps.map((step) => {
        const against = getStepAdversaries(step, adversaries).map((adversary) =>
          adversary.label.toLowerCase(),
        )
        const name = step.outside
          ? `${step.name}, ${ADVICE.outsideLabel}`
          : step.name
        const text = step.randomWait
          ? `${step.text} ${getWaitInstruction(waitWindowDays)}`
          : step.text
        return `**${name}.** ${text} ${ADVICE.againstLabel}: ${against.join(', ')}.`
      }),
    ),
    uncovered.length > 0
      ? `**${ADVICE.uncoveredLabel}:** ${uncovered.map((adversary) => adversary.label.toLowerCase()).join(', ')}.`
      : '',
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
