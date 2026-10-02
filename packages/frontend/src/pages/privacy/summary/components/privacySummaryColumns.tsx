import { formatCurrency } from '@l2beat/shared-pure'
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import {
  ProjectNameCell,
  ProjectNameInfoTooltip,
} from '~/components/table/cells/ProjectNameCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
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
import { toPrivacyProjectCellProject } from '../../toPrivacyProjectCellProject'
import type { PrivacySummaryOptionalColumn } from '../privacyTypes'
import { AnonymitySetCell } from './AnonymitySetCell'
import { PrivacyAssessmentCell } from './PrivacyAssessmentCell'
import { PrivacyTrustedSetupCell } from './PrivacyTrustedSetupCell'

const columnHelper = createColumnHelper<PrivacySummaryEntry>()

// biome-ignore lint/suspicious/noExplicitAny: column value types differ per column
type PrivacyColumn = ColumnDef<PrivacySummaryEntry, any>

function MetricCell({ children }: { children: React.ReactNode }) {
  if (children === undefined || children === null) {
    return <NoDataBadge />
  }

  return <span className="font-medium text-sm">{children}</span>
}

const OPTIONAL_COLUMN_IDS: Record<PrivacySummaryOptionalColumn, string[]> = {
  tvl: ['totalValueLockedUsd'],
  trustedSetup: ['trustedSetup'],
  anonymitySet: ['anonymitySet'],
}

const leadingColumns: PrivacyColumn[] = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => {
      const project = toPrivacyProjectCellProject(ctx.row.original)

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
          {value === undefined ? undefined : formatCurrency(value, 'usd')}
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
      header: 'Anon. set',
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

/**
 * The adversaries alone on the L2 risk rosette - five adversaries, five
 * slices, sorted by the folded value behind them. The legend above the tables
 * says what the colours mean.
 */
const adversaryRosetteColumn: PrivacyColumn = columnHelper.accessor(
  privacyAccessor,
  {
    id: 'privacy',
    header: 'Privacy',
    cell: (ctx) => (
      <PrivacyAdversaryRosetteCell
        adversaries={ctx.row.original.adversaries}
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

/** The protocol risks as they were on main, shaded as one group. */
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
  hiddenColumns,
}: {
  hiddenColumns: PrivacySummaryOptionalColumn[]
}): PrivacyColumn[] {
  const hiddenIds = [
    ...hiddenColumns.flatMap((column) => OPTIONAL_COLUMN_IDS[column]),
    // One headline number per table: TVL where funds sit in the protocol, the
    // 30-day volume where they only pass through.
    ...(hiddenColumns.includes('tvl') ? [] : ['totalValueDeposited30dUsd']),
  ]

  return withoutHiddenColumns(
    [
      ...leadingColumns,
      adversaryRosetteColumn,
      ...metricColumns,
      protocolRiskColumns,
    ],
    hiddenIds,
  )
}

/** Drops the hidden columns, including those inside a group. */
function withoutHiddenColumns(
  columns: PrivacyColumn[],
  hiddenIds: string[],
): PrivacyColumn[] {
  return columns
    .filter((column) => !hiddenIds.includes(getColumnId(column)))
    .map((column) =>
      'columns' in column && column.columns
        ? {
            ...column,
            columns: withoutHiddenColumns(column.columns, hiddenIds),
          }
        : column,
    )
}

function getColumnId(column: PrivacyColumn): string {
  if (column.id !== undefined) {
    return column.id
  }
  return 'accessorKey' in column ? String(column.accessorKey) : ''
}
