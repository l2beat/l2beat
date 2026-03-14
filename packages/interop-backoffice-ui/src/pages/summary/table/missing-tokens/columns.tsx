import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { SummaryMissingTokenRow } from '../types'
import {
  formatMissingTokenAddress,
  getMissingTokenAddTokenLink,
  getMissingTokenExplorerAddress,
} from './utils'

interface CreateMissingTokensColumnsOptions {
  getExplorerUrl: (chain: string) => string | undefined
}

export function createMissingTokensColumns({
  getExplorerUrl,
}: CreateMissingTokensColumnsOptions): ColumnDef<SummaryMissingTokenRow>[] {
  return [
    {
      accessorKey: 'chain',
      header: (props) => <SortableHeader {...props} label="Chain" />,
      meta: {
        csvHeader: 'Chain',
      },
    },
    {
      id: 'tokenAddress',
      accessorFn: (row) => formatMissingTokenAddress(row.tokenAddress),
      header: (props) => <SortableHeader {...props} label="Address" />,
      cell: ({ row }) => {
        const explorerUrl = getExplorerUrl(row.original.chain)
        const explorerAddress = getMissingTokenExplorerAddress(
          row.original.tokenAddress,
        )
        const displayAddress = formatMissingTokenAddress(
          row.original.tokenAddress,
        )

        if (!explorerUrl || !explorerAddress) {
          return <span className="font-mono text-xs">{displayAddress}</span>
        }

        return (
          <ExternalLink
            href={`${explorerUrl}/address/${explorerAddress}`}
            className="font-mono text-xs"
          >
            {displayAddress}
          </ExternalLink>
        )
      },
      meta: {
        csvHeader: 'Address',
        csvValue: ({ row }) =>
          formatMissingTokenAddress(row.original.tokenAddress),
      },
    },
    {
      accessorKey: 'count',
      header: (props) => <SortableHeader {...props} label="Count" />,
      meta: {
        csvHeader: 'Count',
      },
    },
    {
      id: 'plugins',
      accessorFn: (row) => row.plugins.join(', '),
      header: (props) => <SortableHeader {...props} label="Plugins" />,
      cell: ({ row }) => {
        if (row.original.plugins.length === 0) {
          return '-'
        }
        return row.original.plugins.join(', ')
      },
      meta: {
        csvHeader: 'Plugins',
        csvValue: ({ row }) => row.original.plugins.join(', '),
      },
    },
    {
      id: 'action',
      header: 'Action',
      enableSorting: false,
      accessorFn: (row) => {
        const link = getMissingTokenAddTokenLink(row.chain, row.tokenAddress)
        return link?.href ?? '-'
      },
      cell: ({ row }) => {
        const link = getMissingTokenAddTokenLink(
          row.original.chain,
          row.original.tokenAddress,
        )

        if (!link) {
          return '-'
        }

        return (
          <ExternalLink href={link.href} className="text-xs">
            {link.label}
          </ExternalLink>
        )
      },
      meta: {
        csvHeader: 'Add token URL',
      },
    },
  ]
}
