import { Address32 } from '@l2beat/shared-pure'
import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import { cn } from '~/utils/cn'
import { formatDollars } from '../transfers/utils'
import type { SummaryAnomalySuspiciousTransferRow } from '../types'
import { formatGapPercent, formatUtcDateTime } from './utils'

interface CreateSuspiciousTransfersColumnsOptions {
  getExplorerUrl: (chain: string) => string | undefined
  valueDiffThresholdPercent: number
}

function shortenHash(hash: string, prefixLength = 10, suffixLength = 8) {
  if (hash.length <= prefixLength + suffixLength + 1) {
    return hash
  }
  return `${hash.slice(0, prefixLength)}...${hash.slice(-suffixLength)}`
}

function getTokenUiHref(props: {
  chain: string
  tokenAddress: string | undefined
}): string | undefined {
  if (!props.chain || !props.tokenAddress) {
    return undefined
  }

  let address = props.tokenAddress
  if (props.tokenAddress !== Address32.NATIVE) {
    address = Address32.cropToEthereumAddress(Address32(props.tokenAddress))
  }

  return `https://tokens.l2beat.com/tokens/${props.chain}/${address}`
}

function getTokenLabel(
  tokenSymbol: string | undefined,
  tokenAddress: string | undefined,
) {
  if (tokenSymbol) {
    return tokenSymbol
  }
  if (!tokenAddress) {
    return '-'
  }
  if (tokenAddress === Address32.NATIVE) {
    return 'native'
  }
  if (tokenAddress === Address32.ZERO) {
    return '0x0'
  }
  const address = Address32.cropToEthereumAddress(Address32(tokenAddress))
  return shortenHash(address)
}

export function createSuspiciousTransfersColumns({
  getExplorerUrl,
  valueDiffThresholdPercent,
}: CreateSuspiciousTransfersColumnsOptions): ColumnDef<SummaryAnomalySuspiciousTransferRow>[] {
  return [
    {
      id: 'timestamp',
      accessorFn: (row) => row.timestamp,
      header: (props) => <SortableHeader {...props} label="Timestamp UTC" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {formatUtcDateTime(row.original.timestamp)}
        </span>
      ),
      meta: {
        csvHeader: 'Timestamp UTC',
      },
    },
    {
      accessorKey: 'plugin',
      header: (props) => <SortableHeader {...props} label="Plugin" />,
      meta: {
        csvHeader: 'Plugin',
      },
    },
    {
      accessorKey: 'transferId',
      header: (props) => <SortableHeader {...props} label="Transfer ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.transferId}</span>
      ),
      meta: {
        csvHeader: 'Transfer ID',
      },
    },
    {
      accessorKey: 'type',
      header: (props) => <SortableHeader {...props} label="Type" />,
      meta: {
        csvHeader: 'Type',
      },
    },
    {
      accessorKey: 'srcChain',
      header: (props) => <SortableHeader {...props} label="Src chain" />,
      meta: {
        csvHeader: 'Src chain',
      },
    },
    {
      accessorKey: 'dstChain',
      header: (props) => <SortableHeader {...props} label="Dst chain" />,
      meta: {
        csvHeader: 'Dst chain',
      },
    },
    {
      id: 'srcToken',
      accessorFn: (row) => getTokenLabel(row.srcSymbol, row.srcTokenAddress),
      header: (props) => <SortableHeader {...props} label="Src token" />,
      cell: ({ row }) => {
        const label = getTokenLabel(
          row.original.srcSymbol,
          row.original.srcTokenAddress,
        )
        const href = getTokenUiHref({
          chain: row.original.srcChain,
          tokenAddress: row.original.srcTokenAddress,
        })

        if (!href) {
          return label
        }

        return (
          <ExternalLink className="text-xs" href={href}>
            {label}
          </ExternalLink>
        )
      },
      meta: {
        csvHeader: 'Src token',
      },
    },
    {
      id: 'dstToken',
      accessorFn: (row) => getTokenLabel(row.dstSymbol, row.dstTokenAddress),
      header: (props) => <SortableHeader {...props} label="Dst token" />,
      cell: ({ row }) => {
        const label = getTokenLabel(
          row.original.dstSymbol,
          row.original.dstTokenAddress,
        )
        const href = getTokenUiHref({
          chain: row.original.dstChain,
          tokenAddress: row.original.dstTokenAddress,
        })

        if (!href) {
          return label
        }

        return (
          <ExternalLink className="text-xs" href={href}>
            {label}
          </ExternalLink>
        )
      },
      meta: {
        csvHeader: 'Dst token',
      },
    },
    {
      id: 'srcValueUsd',
      accessorFn: (row) => row.srcValueUsd ?? -1,
      header: (props) => <SortableHeader {...props} label="Src value (USD)" />,
      cell: ({ row }) => formatDollars(row.original.srcValueUsd),
      meta: {
        csvHeader: 'Src value (USD)',
        csvValue: ({ row }) => formatDollars(row.original.srcValueUsd),
      },
    },
    {
      id: 'dstValueUsd',
      accessorFn: (row) => row.dstValueUsd ?? -1,
      header: (props) => <SortableHeader {...props} label="Dst value (USD)" />,
      cell: ({ row }) => formatDollars(row.original.dstValueUsd),
      meta: {
        csvHeader: 'Dst value (USD)',
        csvValue: ({ row }) => formatDollars(row.original.dstValueUsd),
      },
    },
    {
      id: 'valueDifferencePercent',
      accessorFn: (row) => row.valueDifferencePercent,
      header: (props) => <SortableHeader {...props} label="Diff %" />,
      cell: ({ row }) => (
        <span
          className={cn(
            'font-semibold',
            row.original.valueDifferencePercent > valueDiffThresholdPercent
              ? 'text-red-700'
              : 'text-emerald-700',
          )}
        >
          {formatGapPercent(row.original.valueDifferencePercent)}
        </span>
      ),
      meta: {
        csvHeader: 'Diff %',
        csvValue: ({ row }) =>
          formatGapPercent(row.original.valueDifferencePercent),
      },
    },
    {
      id: 'srcTxHash',
      accessorFn: (row) => row.srcTxHash,
      header: (props) => <SortableHeader {...props} label="Src tx" />,
      cell: ({ row }) => {
        const explorerUrl = getExplorerUrl(row.original.srcChain)
        const label = shortenHash(row.original.srcTxHash)
        if (!explorerUrl) {
          return <span className="font-mono text-xs">{label}</span>
        }

        return (
          <ExternalLink
            className="font-mono text-xs"
            href={`${explorerUrl}/tx/${row.original.srcTxHash}`}
          >
            {label}
          </ExternalLink>
        )
      },
      meta: {
        csvHeader: 'Src tx',
      },
    },
    {
      id: 'dstTxHash',
      accessorFn: (row) => row.dstTxHash,
      header: (props) => <SortableHeader {...props} label="Dst tx" />,
      cell: ({ row }) => {
        const explorerUrl = getExplorerUrl(row.original.dstChain)
        const label = shortenHash(row.original.dstTxHash)
        if (!explorerUrl) {
          return <span className="font-mono text-xs">{label}</span>
        }

        return (
          <ExternalLink
            className="font-mono text-xs"
            href={`${explorerUrl}/tx/${row.original.dstTxHash}`}
          >
            {label}
          </ExternalLink>
        )
      },
      meta: {
        csvHeader: 'Dst tx',
      },
    },
  ]
}
