import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { PrivacySummaryEntry } from '../getPrivacySummaryData'
import { PrivacyTrustedSetupCell } from './PrivacyTrustedSetupCell'

const columnHelper = createColumnHelper<PrivacySummaryEntry>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Project',
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
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
      </TableLink>
    ),
    enableSorting: false,
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
  columnHelper.accessor('totalValueLockedUsd', {
    id: 'totalValueLockedUsd',
    header: 'Total value locked',
    cell: (ctx) => (
      <span className="font-medium text-base">
        {formatCurrency(ctx.getValue(), 'usd')}
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
        {formatInteger(ctx.getValue())}
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
    header: 'Total value deposited 30D',
    cell: (ctx) => (
      <span className="font-medium text-base">
        {formatCurrency(ctx.getValue(), 'usd')}
      </span>
    ),
    meta: {
      align: 'right',
      tooltip:
        'Total USD value of all deposits over the last 30 days, based on configured token prices.',
    },
  }),
  columnHelper.accessor('totalDeposits30d', {
    header: 'Total deposits 30D',
    cell: (ctx) => (
      <span className="font-medium text-base">
        {formatInteger(ctx.getValue())}
      </span>
    ),
    meta: {
      align: 'right',
      tooltip:
        'Deposit count over the last 30 days aggregated across all tracked tokens and buckets.',
    },
  }),
  columnHelper.accessor('poolsTracked', {
    header: 'Pools tracked',
    cell: (ctx) => (
      <span className="font-medium text-base">
        {formatInteger(ctx.getValue())}
      </span>
    ),
    meta: {
      align: 'right',
      tooltip:
        'The total number of tracked buckets for the protocol, including pools and denominations.',
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
    <div className="[&_thead]:normal-case! [&_th]:normal-case!">
      <BasicTable table={table} />
    </div>
  )
}
