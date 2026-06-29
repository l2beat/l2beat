import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { PrivacyAttributeTag } from '~/components/PrivacyAttributeTag'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { PRIVACY_ASSESSMENT } from '../../privacyAssessment'
import { PrivacyAssessmentCell } from './PrivacyAssessmentCell'
import { PrivacyTrustedSetupCell } from './PrivacyTrustedSetupCell'

const columnHelper = createColumnHelper<PrivacySummaryEntry>()

function MetricCell({ children }: { children: React.ReactNode }) {
  if (children === undefined || children === null) {
    return <NoDataBadge />
  }

  return <span className="font-medium text-base">{children}</span>
}

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
        <TwoRowCell>
          <TwoRowCell.First>
            <ProjectNameCell
              project={{
                name: ctx.row.original.name,
                shortName: ctx.row.original.shortName,
                slug: ctx.row.original.slug,
                icon: ctx.row.original.icon,
                backgroundColor: undefined,
                description: ctx.row.original.description,
                statuses: {
                  underReview: ctx.row.original.isUnderReview
                    ? 'config'
                    : undefined,
                },
              }}
            />
          </TwoRowCell.First>
          <TwoRowCell.Second>
            {ctx.row.original.isTracked
              ? `${formatInteger(ctx.row.original.poolsTracked)} pools tracked`
              : 'Not tracked'}
          </TwoRowCell.Second>
        </TwoRowCell>
      </TableLink>
    ),
    enableSorting: false,
    meta: {
      cellClassName: 'pl-4',
      headClassName: 'pl-4',
    },
  }),
  columnHelper.accessor('totalValueLockedUsd', {
    id: 'totalValueLockedUsd',
    header: 'TVL',
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
        'Total USD value currently held across all tracked assets for the protocol.',
    },
  }),
  columnHelper.accessor('totalDeposits', {
    header: 'Total deposits',
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
    header: '30D volume',
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
  columnHelper.display({
    id: 'trustedSetup',
    header: 'Trusted setup',
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
    header: 'Exit window',
    cell: (ctx) => (
      <PrivacyAssessmentCell value={ctx.row.original.exitWindow} showValue />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.exitWindow, b.original.exitWindow),
    meta: {
      align: 'center',
      tooltip:
        'Time users have to withdraw before a malicious upgrade can take effect.',
    },
  }),
  columnHelper.accessor((entry) => adjustTableValue(entry.privacy), {
    id: 'privacy',
    header: PRIVACY_ASSESSMENT.title,
    cell: (ctx) => (
      <PrivacyAssessmentCell value={ctx.row.original.privacy} showValue />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.privacy, b.original.privacy),
    meta: {
      align: 'center',
      tooltip: PRIVACY_ASSESSMENT.tooltip,
    },
  }),
  columnHelper.accessor((entry) => adjustTableValue(entry.reproducibility), {
    id: 'reproducibility',
    header: 'Reproducibility',
    cell: (ctx) => (
      <PrivacyAssessmentCell
        value={ctx.row.original.reproducibility}
        showValue
      />
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
  columnHelper.display({
    id: 'attributes',
    header: 'Attributes',
    cell: (ctx) => {
      const attributes = ctx.row.original.attributes

      if (attributes.length === 0) {
        return <NoDataBadge />
      }

      return (
        <div className="flex max-w-[220px] flex-wrap gap-1">
          {attributes.map((attribute) => (
            <PrivacyAttributeTag key={attribute.id} attribute={attribute} />
          ))}
        </div>
      )
    },
    enableSorting: false,
    meta: {
      tooltip: 'Protocol attributes and capabilities.',
    },
  }),
]

const initialSorting: SortingState = [{ id: 'totalValueLockedUsd', desc: true }]

export function PrivacySummaryTable({
  entries,
}: {
  entries: PrivacySummaryEntry[]
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const table = useTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  return (
    <PrimaryCard className="mt-4">
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
