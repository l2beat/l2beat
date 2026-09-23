import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { PercentChange } from '~/components/PercentChange'
import { PrivacyAttributeTag } from '~/components/PrivacyAttributeTag'
import {
  ProjectNameCell,
  ProjectNameInfoTooltip,
} from '~/components/table/cells/ProjectNameCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { withChangeSort } from '~/components/table/sorting/changeSortColumn'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableLink } from '~/components/table/TableLink'
import { ANONYMITY_SET_WINDOW_DAYS } from '~/server/features/privacy/anonymity-set/calculateAnonymitySets'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { getPrivacyAdversariesTableValue } from '../../adversaries/privacyAdversaryUi'
import { PRIVACY_ASSESSMENT } from '../../privacyAssessment'
import { PrivacyAdversaryRosetteCell } from '../../rosette/PrivacyAdversaryRosetteCell'
import { PrivacyRosetteCell } from '../../rosette/PrivacyRosetteCell'
import type {
  PrivacySummaryOptionalColumn,
  PrivacySummaryView,
} from '../privacySummaryViews'
import { AnonymitySetCell } from './AnonymitySetCell'
import { PrivacyAssessmentCell } from './PrivacyAssessmentCell'
import { PrivacyTrustedSetupCell } from './PrivacyTrustedSetupCell'

const columnHelper = createColumnHelper<PrivacySummaryEntry>()

// biome-ignore lint/suspicious/noExplicitAny: column value types differ per column
type PrivacyColumn = ColumnDef<PrivacySummaryEntry, any>

/** The layouts rendered as a table; cards have their own component. */
export type PrivacyTableView = Exclude<PrivacySummaryView, 'cards'>

function MetricCell({ children }: { children: React.ReactNode }) {
  if (children === undefined || children === null) {
    return <NoDataBadge />
  }

  return <span className="font-medium text-sm">{children}</span>
}

const OPTIONAL_COLUMN_IDS: Record<PrivacySummaryOptionalColumn, string[]> = {
  tvl: ['totalValueLockedUsd', 'totalValueLockedUsdChange'],
}

/** Left out of the half-width tables of the grid, which only fit the essentials. */
const COMPACT_HIDDEN_COLUMN_IDS = [
  'totalValueLockedUsdChange',
  'totalDeposits',
  'attributes',
]

const leadingColumns: PrivacyColumn[] = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => {
      const project = {
        name: ctx.row.original.name,
        shortName: ctx.row.original.shortName,
        slug: ctx.row.original.slug,
        icon: ctx.row.original.icon,
        backgroundColor: undefined,
        description: ctx.row.original.description,
        quantumResistance: ctx.row.original.quantumResistant
          ? 'privacy'
          : undefined,
        statuses: {
          underReview: ctx.row.original.isUnderReview ? 'config' : undefined,
        },
      } as const

      return (
        <ProjectNameInfoTooltip project={project}>
          <TableLink href={ctx.row.original.href}>
            <TwoRowCell>
              <TwoRowCell.First>
                <ProjectNameCell project={project} withInfoTooltip />
              </TwoRowCell.First>
              <TwoRowCell.Second>
                {ctx.row.original.category.label}
              </TwoRowCell.Second>
            </TwoRowCell>
          </TableLink>
        </ProjectNameInfoTooltip>
      )
    },
    enableSorting: false,
    meta: {
      cellClassName: 'pl-4',
      headClassName: 'pl-4',
    },
  }),
].map((column) => column as PrivacyColumn)

const metricColumns: PrivacyColumn[] = [
  ...withChangeSort(
    columnHelper,
    columnHelper.accessor('totalValueLockedUsd', {
      id: 'totalValueLockedUsd',
      header: 'TVL',
      cell: (ctx) => {
        if (!ctx.row.original.hasTvl) {
          return <NotApplicableBadge />
        }

        const value = ctx.getValue()
        return (
          <MetricCell>
            {value === undefined ? undefined : (
              <div className="flex items-center justify-end gap-2">
                {formatCurrency(value, 'usd')}
                {/* Only alongside the 7D% column; compact tables leave both out. */}
                {ctx.table
                  .getAllLeafColumns()
                  .some((c) => c.id === 'totalValueLockedUsdChange') &&
                  ctx.row.original.totalValueLockedChange7d !== undefined && (
                    <PercentChange
                      value={ctx.row.original.totalValueLockedChange7d}
                      period="7D"
                    />
                  )}
              </div>
            )}
          </MetricCell>
        )
      },
      sortUndefined: 'last',
      meta: {
        align: 'right',
        tooltip:
          'Total USD value currently held across all tracked assets for the protocol.',
      },
    }),
    (row) => ({
      change: row.totalValueLockedChange7d,
      period: '7D',
    }),
  ),
  columnHelper.accessor('totalDeposits', {
    header: 'Deposits',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <MetricCell>
          {value === undefined ? undefined : formatInteger(value)}
        </MetricCell>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'Total deposit count aggregated across all tracked tokens and buckets.',
    },
  }),
  columnHelper.accessor('totalValueDeposited30dUsd', {
    id: 'totalValueDeposited30dUsd',
    header: '30D vol.',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <MetricCell>
          {value === undefined ? undefined : formatCurrency(value, 'usd')}
        </MetricCell>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'Total USD value of all deposits over the last 30 days, based on configured token prices.',
    },
  }),
  columnHelper.accessor(
    (entry) =>
      entry.anonymitySet.status === 'available'
        ? entry.anonymitySet.value
        : undefined,
    {
      id: 'anonymitySet',
      header: `${ANONYMITY_SET_WINDOW_DAYS}D anon. set`,
      cell: (ctx) => (
        <AnonymitySetCell
          anonymitySet={ctx.row.original.anonymitySet}
          projectName={ctx.row.original.name}
        />
      ),
      sortUndefined: 'last',
      meta: {
        align: 'right',
        tooltip: `Largest configured anonymity set: unique deposit senders during the last ${ANONYMITY_SET_WINDOW_DAYS} complete UTC days.`,
      },
    },
  ),
].map((column) => column as PrivacyColumn)

const attributesColumn: PrivacyColumn = columnHelper.display({
  id: 'attributes',
  header: 'Attributes',
  cell: (ctx) => {
    const attributes = ctx.row.original.attributes

    if (attributes.length === 0) {
      return <NoDataBadge />
    }

    const half = Math.ceil(attributes.length / 2)
    const rows = [attributes.slice(0, half), attributes.slice(half)].filter(
      (row) => row.length > 0,
    )

    return (
      <div className="flex w-max flex-col gap-1">
        {rows.map((row, index) => (
          <div key={index} className="flex gap-1">
            {row.map((attribute) => (
              <PrivacyAttributeTag key={attribute.id} attribute={attribute} />
            ))}
          </div>
        ))}
      </div>
    )
  },
  enableSorting: false,
  meta: {
    tooltip: 'Protocol attributes and capabilities.',
  },
})

const privacyAccessor = (entry: PrivacySummaryEntry) =>
  getPrivacyAdversariesTableValue(entry.adversaries)

/** The folded adversary value, the same order the server sends entries in. */
const privacySortingFn = (
  a: { original: PrivacySummaryEntry },
  b: { original: PrivacySummaryEntry },
) =>
  sortTableValues(
    getPrivacyAdversariesTableValue(a.original.adversaries),
    getPrivacyAdversariesTableValue(b.original.adversaries),
  )

/** V2 and V3: one rosette over the adversaries and the protocol risks. */
const getRosetteColumn = (compact: boolean): PrivacyColumn =>
  columnHelper.accessor(privacyAccessor, {
    // Also the label in the columns picker, which shows the id whenever the
    // header is not a plain string.
    id: 'privacy',
    header: () =>
      compact ? (
        <>
          Privacy
          <br />& risks
        </>
      ) : (
        <>
          Privacy and
          <br />
          protocol risks
        </>
      ),
    cell: (ctx) => (
      <PrivacyRosetteCell
        adversaries={ctx.row.original.adversaries}
        trustedSetup={ctx.row.original.trustedSetup}
        exitWindow={ctx.row.original.exitWindow}
        reproducibility={ctx.row.original.reproducibility}
        href={ctx.row.original.href}
        isUnderReview={ctx.row.original.isUnderReview}
      />
    ),
    sortDescFirst: true,
    sortingFn: privacySortingFn,
    meta: {
      align: 'center',
      tooltip: PRIVACY_ASSESSMENT.rosetteTooltip,
    },
  })

/**
 * V1 and V2: the adversaries alone on the L2 risk rosette - five adversaries,
 * five slices. It still sorts by the score behind it; the count itself is in
 * the rosette's tooltip.
 */
const adversaryRosetteColumn: PrivacyColumn = columnHelper.accessor(
  privacyAccessor,
  {
    id: 'privacy',
    header: 'Privacy',
    cell: (ctx) => (
      <PrivacyAdversaryRosetteCell
        adversaries={ctx.row.original.adversaries}
        trustedSetup={ctx.row.original.trustedSetup}
        exitWindow={ctx.row.original.exitWindow}
        reproducibility={ctx.row.original.reproducibility}
        href={ctx.row.original.href}
        isUnderReview={ctx.row.original.isUnderReview}
      />
    ),
    sortDescFirst: true,
    sortingFn: privacySortingFn,
    meta: {
      align: 'center',
      tooltip: PRIVACY_ASSESSMENT.tooltip,
    },
  },
)

/** V1 and V2: the protocol risks as they were on main, shaded as one group. */
const protocolRiskColumns: PrivacyColumn = columnHelper.group({
  id: 'protocolRisks',
  // No group title: the shaded, rounded background already sets the three
  // risk columns apart, and a title row would push the table down by its own
  // height for the sake of two words.
  columns: [
    columnHelper.display({
      id: 'trustedSetup',
      header: 'Setup',
      cell: (ctx) => (
        <PrivacyTrustedSetupCell trustedSetup={ctx.row.original.trustedSetup} />
      ),
      enableSorting: false,
      meta: {
        align: 'center',
        tooltip:
          "Trusted setup used by the project's proving system and its risk.",
      },
    }),
    columnHelper.accessor((entry) => adjustTableValue(entry.exitWindow), {
      id: 'exitWindow',
      header: 'Exit',
      cell: (ctx) => (
        <PrivacyAssessmentCell
          value={ctx.row.original.exitWindow}
          walkawayTest={ctx.row.original.exitWindow.walkawayTest}
        />
      ),
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(a.original.exitWindow, b.original.exitWindow),
      meta: {
        align: 'center',
        tooltip:
          'Time users have to withdraw before a malicious upgrade can take effect. The walkaway test says whether users can still use the protocol if every centralized participant disappears.',
      },
    }),
    columnHelper.accessor((entry) => adjustTableValue(entry.reproducibility), {
      id: 'reproducibility',
      header: 'Repro',
      cell: (ctx) => (
        <PrivacyAssessmentCell value={ctx.row.original.reproducibility} />
      ),
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(a.original.reproducibility, b.original.reproducibility),
      meta: {
        align: 'center',
        tooltip:
          'Whether all source code needed to audit the protocol and participate in it is published and can be used locally.',
      },
    }),
  ],
})

export function getPrivacySummaryColumns({
  view,
  hiddenColumns,
  compact,
}: {
  view: PrivacyTableView
  hiddenColumns: PrivacySummaryOptionalColumn[]
  /** Leaves out the columns a half-width table has no room for. */
  compact?: boolean
}): PrivacyColumn[] {
  const assessment: Record<
    PrivacyTableView,
    { afterName: PrivacyColumn[]; afterMetrics: PrivacyColumn[] }
  > = {
    grid: { afterName: [getRosetteColumn(!!compact)], afterMetrics: [] },
    gridSplit: {
      afterName: [adversaryRosetteColumn],
      afterMetrics: [protocolRiskColumns],
    },
    rosette: { afterName: [getRosetteColumn(false)], afterMetrics: [] },
    split: {
      afterName: [adversaryRosetteColumn],
      afterMetrics: [protocolRiskColumns],
    },
  }

  const hiddenIds = [
    ...hiddenColumns.flatMap((column) => OPTIONAL_COLUMN_IDS[column]),
    ...(compact ? COMPACT_HIDDEN_COLUMN_IDS : []),
    // One headline number per compact table: TVL where funds sit in the
    // protocol, the 30-day volume where they only pass through.
    ...(compact && !hiddenColumns.includes('tvl')
      ? ['totalValueDeposited30dUsd']
      : []),
  ]

  return [
    ...leadingColumns,
    ...assessment[view].afterName,
    ...metricColumns,
    ...assessment[view].afterMetrics,
    attributesColumn,
  ]
    .filter((column) => !hiddenIds.includes(getColumnId(column)))
    .map((column) => withoutMissingChangeSort(column, hiddenIds))
    .map((column) => {
      const header = compact ? COMPACT_HEADERS[getColumnId(column)] : undefined
      return header ? { ...column, header } : column
    })
}

/** Shorter headers where a half-width table would otherwise clip a column. */
const COMPACT_HEADERS: Record<string, string> = {
  anonymitySet: 'Anon. set',
}

/**
 * A value column whose 7D% companion was left out becomes a plain column: its
 * header would otherwise look for the companion and fail.
 */
function withoutMissingChangeSort(
  column: PrivacyColumn,
  hiddenIds: string[],
): PrivacyColumn {
  const changeSortColumnId = column.meta?.changeSortColumnId
  if (!changeSortColumnId || !hiddenIds.includes(changeSortColumnId)) {
    return column
  }
  return { ...column, meta: { ...column.meta, changeSortColumnId: undefined } }
}

function getColumnId(column: PrivacyColumn): string {
  if (column.id !== undefined) {
    return column.id
  }
  return 'accessorKey' in column ? String(column.accessorKey) : ''
}
