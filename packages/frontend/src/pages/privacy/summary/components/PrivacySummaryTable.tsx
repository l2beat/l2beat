import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { PrivacyAttributesCell } from './PrivacyAttributesCell'
import { PrivacyTrustedSetupCell } from './PrivacyTrustedSetupCell'

const columnHelper = createColumnHelper<PrivacySummaryEntry>()

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Project',
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
            {formatInteger(ctx.row.original.poolsTracked)} pools tracked
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
        "Shows the trusted setup used by the project's proving system and its risk.",
    },
  }),
  columnHelper.accessor('totalValueSecuredUsd', {
    id: 'totalValueSecuredUsd',
    header: 'TVS',
    cell: (ctx) => (
      <span className="font-medium text-base">
        {formatCurrency(ctx.getValue() ?? 0, 'usd')}
      </span>
    ),
    meta: {
      align: 'right',
      tooltip:
        'Total USD value currently held across all tracked assets for the protocol.',
    },
  }),
  columnHelper.accessor('totalDeposits', {
    header: 'Total deposits',
    cell: (ctx) => (
      <span className="font-medium text-base">
        {formatInteger(ctx.getValue() ?? 0)}
      </span>
    ),
    meta: {
      align: 'right',
      tooltip:
        'Total deposit count aggregated across all tracked tokens and buckets.',
    },
  }),
  columnHelper.accessor('totalValueDeposited30dUsd', {
    id: 'totalValueDeposited30dUsd',
    header: '30D volume',
    cell: (ctx) => (
      <span className="font-medium text-base">
        {formatCurrency(ctx.getValue() ?? 0, 'usd')}
      </span>
    ),
    meta: {
      align: 'right',
      tooltip:
        'Total USD value of all deposits over the last 30 days, based on configured token prices.',
    },
  }),
  columnHelper.accessor('attributes', {
    header: 'Attributes',
    cell: (ctx) => <PrivacyAttributesCell attributes={ctx.getValue()} />,
    enableSorting: false,
    meta: {
      tooltip:
        'Protocol-level privacy, compliance, upgradeability, and usage attributes.',
      cellClassName: 'pr-1!',
    },
  }),
]

const initialSorting: SortingState = [
  { id: 'totalValueSecuredUsd', desc: true },
]

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
