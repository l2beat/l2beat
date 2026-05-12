import { pluralize } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { BasicTable } from '~/components/table/BasicTable'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type {
  PrivacySummaryAttribute,
  PrivacySummaryEntry,
} from '../getPrivacySummaryData'
import { PrivacyTrustedSetupCell } from './PrivacyTrustedSetupCell'

const columnHelper = createColumnHelper<PrivacySummaryEntry>()

const ATTRIBUTE_CLASS_NAMES: Record<PrivacySummaryAttribute['id'], string> = {
  upgradeable: 'text-[#5A3216] bg-[#FFA91E] border-[#D78400]',
  'opt-compliance': 'text-[#004B3A] bg-[#A6F5D2] border-[#29BD8C]',
  transfers: 'text-[#4B1877] bg-[#D9B4FF] border-[#A45CDB]',
  defi: 'text-[#5D1163] bg-[#F7B3FF] border-[#D96BE8]',
  'any-amount': 'text-[#3F1E6D] bg-[#C7B8FF] border-[#8D78D9]',
  'fixed-amounts': 'text-[#452576] bg-[#D8CEFF] border-[#9B86E6]',
  'open-source': 'bg-[#CCD0DA] border-[#808CAA] text-[#272A2F]',
  immutable: 'text-[#6B4A00] bg-[#FFE08A] border-[#D6A900]',
  uncensorable: 'text-[#00445A] bg-[#A9ECF4] border-[#46C7D9]',
  'enforced-compliance': 'text-[#235000] bg-[#C9F59B] border-[#7AC943]',
}

const columns = [
  columnHelper.accessor('name', {
    header: 'Project',
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
        <ProjectNameCell
          project={{
            name: ctx.row.original.name,
            shortName: ctx.row.original.shortName,
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
      <TwoRowCell className="text-right">
        <TwoRowCell.First>
          <span className="font-medium text-base">
            {formatInteger(ctx.getValue())}
          </span>
        </TwoRowCell.First>
        <TwoRowCell.Second>
          {formatInteger(ctx.row.original.poolsTracked)}{' '}
          {pluralize(ctx.row.original.poolsTracked, 'pool')}
        </TwoRowCell.Second>
      </TwoRowCell>
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
        {formatCurrency(ctx.getValue(), 'usd')}
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

function PrivacyAttributesCell({
  attributes,
}: {
  attributes: PrivacySummaryAttribute[]
}) {
  return (
    <div className="flex min-w-[240px] flex-wrap gap-x-[5px] gap-y-1 py-2">
      {attributes.map((attribute) => (
        <PrivacyAttributeTag key={attribute.id} attribute={attribute} />
      ))}
    </div>
  )
}

function PrivacyAttributeTag({
  attribute,
}: {
  attribute: PrivacySummaryAttribute
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'select-none rounded-sm border px-1.5 py-1 font-medium text-[13px] leading-none',
            ATTRIBUTE_CLASS_NAMES[attribute.id],
          )}
        >
          {attribute.label}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{attribute.description}</p>
      </TooltipContent>
    </Tooltip>
  )
}
