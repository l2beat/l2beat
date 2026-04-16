import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { Checkbox } from '~/components/core/Checkbox'
import { ExternalLink } from '~/components/ExternalLink'
import { cn } from '~/utils/cn'
import { MissingTokenStatusBadge } from '../MissingTokenStatusBadge'
import type { MissingTokenRow } from '../types'
import {
  getMissingTokenAction,
  getMissingTokenAddressDisplay,
  getMissingTokenExplorerHref,
  getMissingTokenRowId,
  getMissingTokenStatusLabel,
} from '../utils'

const columnHelper = createColumnHelper<MissingTokenRow>()

export function createMissingTokensColumns(options: {
  getExplorerUrl: (chain: string) => string | undefined
  isRowSelected: (row: MissingTokenRow) => boolean
  isRowSelectable: (row: MissingTokenRow) => boolean
  setRowsSelected: (rows: MissingTokenRow[], selected: boolean) => void
  toggleRowSelected: (row: MissingTokenRow, selected: boolean) => void
  isActionVisited: (row: MissingTokenRow) => boolean
  onActionVisited: (row: MissingTokenRow) => void
}): TableOptions<MissingTokenRow>['columns'] {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => {
        const selectableRows = table
          .getFilteredRowModel()
          .rows.map((row) => row.original)
          .filter(options.isRowSelectable)
        const allSelected =
          selectableRows.length > 0 &&
          selectableRows.every(options.isRowSelected)
        const someSelected =
          selectableRows.length > 0 &&
          selectableRows.some(options.isRowSelected) &&
          !allSelected

        return (
          <Checkbox
            aria-label="Select all rows"
            checked={
              allSelected ? true : someSelected ? 'indeterminate' : false
            }
            disabled={selectableRows.length === 0}
            onCheckedChange={(checked) =>
              options.setRowsSelected(selectableRows, checked === true)
            }
          />
        )
      },
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select ${row.original.chain} ${getMissingTokenAddressDisplay(row.original.tokenAddress)}`}
          checked={options.isRowSelected(row.original)}
          disabled={!options.isRowSelectable(row.original)}
          onCheckedChange={(checked) =>
            options.toggleRowSelected(row.original, checked === true)
          }
        />
      ),
      enableSorting: false,
      meta: {
        excludeFromCsv: true,
      },
    }),
    columnHelper.accessor('chain', {
      header: 'Chain',
      meta: {
        csvHeader: 'Chain',
      },
    }),
    columnHelper.accessor('tokenAddress', {
      id: 'address',
      header: 'Address',
      cell: ({ row }) => {
        const explorerHref = getMissingTokenExplorerHref({
          address: row.original.tokenAddress,
          explorerUrl: options.getExplorerUrl(row.original.chain),
        })
        const label = getMissingTokenAddressDisplay(row.original.tokenAddress)

        if (!explorerHref) {
          return <span className="font-mono text-xs">{label}</span>
        }

        return (
          <ExternalLink href={explorerHref} className="font-mono text-xs">
            {label}
          </ExternalLink>
        )
      },
      meta: {
        csvHeader: 'Address',
        getCsvValue: ({ row }) => row.original.tokenAddress,
      },
    }),
    columnHelper.accessor('tokenDbStatus', {
      header: 'TokenDB status',
      cell: ({ getValue }) => {
        const status = getValue()
        return <MissingTokenStatusBadge status={status} />
      },
      meta: {
        csvHeader: 'TokenDB status',
        getCsvValue: ({ row }) =>
          getMissingTokenStatusLabel(row.original.tokenDbStatus),
      },
    }),
    columnHelper.accessor('count', {
      header: 'Count',
      meta: {
        csvHeader: 'Count',
      },
    }),
    columnHelper.accessor((row) => row.plugins.join(', '), {
      id: 'plugins',
      header: 'Plugins',
      cell: ({ row }) =>
        row.original.plugins.length > 0 ? (
          row.original.plugins.join(', ')
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      meta: {
        csvHeader: 'Plugins',
        getCsvValue: ({ row }) => row.original.plugins.join(', '),
      },
    }),
    columnHelper.display({
      id: 'action',
      header: () => 'Action',
      cell: ({ row }) => {
        const action = getMissingTokenAction({
          chain: row.original.chain,
          address: row.original.tokenAddress,
          tokenDbStatus: row.original.tokenDbStatus,
        })

        if (!action) {
          return <span className="text-muted-foreground text-xs">-</span>
        }

        const wasVisited = options.isActionVisited(row.original)

        return (
          <ExternalLink
            href={action.href}
            className={cn(
              'text-xs',
              wasVisited && 'text-violet-600 hover:text-violet-700',
            )}
            onClick={() => options.onActionVisited(row.original)}
          >
            {action.label}
          </ExternalLink>
        )
      },
      enableSorting: false,
      meta: {
        csvHeader: 'Action',
        getCsvValue: ({ row }) => {
          const action = getMissingTokenAction({
            chain: row.original.chain,
            address: row.original.tokenAddress,
            tokenDbStatus: row.original.tokenDbStatus,
          })

          return action?.href ?? ''
        },
      },
    }),
  ]
}

export function getMissingTokensSelectionId(row: MissingTokenRow) {
  return getMissingTokenRowId({
    chain: row.chain,
    tokenAddress: row.tokenAddress,
  })
}
