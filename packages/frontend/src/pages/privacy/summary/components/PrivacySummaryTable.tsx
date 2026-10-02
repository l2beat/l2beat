import { formatCurrency } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { BasicTable } from '~/components/table/BasicTable'
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
import { useTable } from '~/hooks/useTable'
import { ANONYMITY_SET_WINDOW_DAYS } from '~/server/features/privacy/anonymity-set/calculateAnonymitySets'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { getPrivacyAdversariesTableValue } from '../../adversaries/privacyAdversaryUi'
import { PRIVACY_ASSESSMENT } from '../../privacyAssessment'
import { PrivacyRosetteCell } from '../../rosette/PrivacyRosetteCell'
import { toPrivacyProjectCellProject } from '../../toPrivacyProjectCellProject'
import {
  PRIVACY_SUMMARY_OPTIONAL_COLUMNS as OPTIONAL_COLUMNS,
  type PrivacySummaryOptionalColumn,
} from '../privacySummaryGroups'
import { AnonymitySetCell } from './AnonymitySetCell'
import { PrivacyAssessmentCell } from './PrivacyAssessmentCell'
import { PrivacyTrustedSetupCell } from './PrivacyTrustedSetupCell'

const columnHelper = createColumnHelper<PrivacySummaryEntry>()

function MetricCell({ children }: { children: React.ReactNode }) {
  if (children === undefined || children === null) {
    return <NoDataBadge />
  }

  return <span className="font-medium text-sm">{children}</span>
}

const columns = [
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
  columnHelper.accessor(
    (entry) => getPrivacyAdversariesTableValue(entry.adversaries),
    {
      id: 'adversaries',
      header: PRIVACY_ASSESSMENT.title,
      cell: (ctx) => (
        <PrivacyRosetteCell
          adversaries={ctx.row.original.adversaries}
          href={ctx.row.original.href}
          isUnderReview={ctx.row.original.isUnderReview}
        />
      ),
      sortDescFirst: true,
      sortingFn: (a, b) =>
        sortTableValues(
          getPrivacyAdversariesTableValue(a.original.adversaries),
          getPrivacyAdversariesTableValue(b.original.adversaries),
        ),
      meta: {
        align: 'center',
        tooltip: PRIVACY_ASSESSMENT.tooltip,
      },
    },
  ),
  columnHelper.accessor('totalValueLockedUsd', {
    id: OPTIONAL_COLUMNS.tvl,
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
    id: OPTIONAL_COLUMNS.volume30d,
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
      id: OPTIONAL_COLUMNS.anonymitySet,
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
  columnHelper.group({
    id: 'protocolRisks',
    columns: [
      columnHelper.display({
        id: OPTIONAL_COLUMNS.trustedSetup,
        header: 'Setup',
        cell: (ctx) => (
          <PrivacyTrustedSetupCell
            trustedSetup={ctx.row.original.trustedSetup}
          />
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
      columnHelper.accessor(
        (entry) => adjustTableValue(entry.reproducibility),
        {
          id: 'reproducibility',
          header: 'Repro',
          cell: (ctx) => (
            <PrivacyAssessmentCell value={ctx.row.original.reproducibility} />
          ),
          sortDescFirst: true,
          sortUndefined: 'last',
          sortingFn: (a, b) =>
            sortTableValues(
              a.original.reproducibility,
              b.original.reproducibility,
            ),
          meta: {
            align: 'center',
            tooltip:
              'Whether all source code needed to audit the protocol and participate in it is published and can be used locally.',
          },
        },
      ),
    ],
  }),
]

export function PrivacySummaryTable({
  entries,
  hiddenColumns,
}: {
  entries: PrivacySummaryEntry[]
  hiddenColumns: PrivacySummaryOptionalColumn[]
}) {
  const table = useTable('PrivacySummaryTable', {
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility: Object.fromEntries(
        hiddenColumns.map((column) => [column, false]),
      ),
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
    // The server already hands the entries over in privacy order; starting the
    // table on the same column marks its arrow so the ordering is visible.
    initialState: {
      sorting: [{ id: 'adversaries', desc: true }],
    },
  })

  return <BasicTable table={table} />
}
