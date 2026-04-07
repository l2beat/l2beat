import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { MissingTokenRow } from '../types'
import {
  getAddMissingTokenHref,
  getMissingTokenAddressDisplay,
  getMissingTokenExplorerHref,
} from '../utils'

const columnHelper = createColumnHelper<MissingTokenRow>()

export function createMissingTokensColumns(options: {
  getExplorerUrl: (chain: string) => string | undefined
}): TableOptions<MissingTokenRow>['columns'] {
  return [
    columnHelper.accessor('chain', {
      header: (props) => <SortableHeader {...props} label="Chain" />,
      meta: {
        csvHeader: 'Chain',
      },
    }),
    columnHelper.accessor('tokenAddress', {
      id: 'address',
      header: (props) => <SortableHeader {...props} label="Address" />,
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
    columnHelper.accessor('count', {
      header: (props) => <SortableHeader {...props} label="Count" />,
      meta: {
        csvHeader: 'Count',
      },
    }),
    columnHelper.accessor((row) => row.plugins.join(', '), {
      id: 'plugins',
      header: (props) => <SortableHeader {...props} label="Plugins" />,
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
      cell: ({ row }) => (
        <ExternalLink
          href={getAddMissingTokenHref({
            chain: row.original.chain,
            address: row.original.tokenAddress,
          })}
          className="text-xs"
        >
          Add token
        </ExternalLink>
      ),
      enableSorting: false,
      meta: {
        csvHeader: 'Action',
        getCsvValue: ({ row }) =>
          getAddMissingTokenHref({
            chain: row.original.chain,
            address: row.original.tokenAddress,
          }),
      },
    }),
  ]
}
