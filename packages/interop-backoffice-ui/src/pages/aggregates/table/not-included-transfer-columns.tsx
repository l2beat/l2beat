import { Address32 } from '@l2beat/shared-pure'
import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import {
  formatDollars,
  formatTokenAmount,
  formatTransferDuration,
  formatTransferTimestamp,
  getAddTokenLinkOptions,
  getTokenAddressDisplay,
  getTransferSideLabel,
  shortenHash,
  toCsvIsoTimestamp,
} from '~/pages/transfers/utils'
import type { NotIncludedTransferRow } from '../types'

const columnHelper = createColumnHelper<NotIncludedTransferRow>()

export function createNotIncludedTransferColumns(options: {
  getExplorerUrl: (chain: string) => string | undefined
}): TableOptions<NotIncludedTransferRow>['columns'] {
  return [
    columnHelper.accessor('timestamp', {
      header: 'Timestamp UTC',
      cell: ({ row }) => formatTransferTimestamp(row.original.timestamp),
      meta: {
        csvHeader: 'Timestamp UTC',
        getCsvValue: ({ row }) => toCsvIsoTimestamp(row.original.timestamp),
      },
    }),
    columnHelper.accessor('plugin', {
      header: 'Plugin',
      meta: {
        csvHeader: 'Plugin',
      },
    }),
    columnHelper.accessor('bridgeType', {
      header: 'Bridge type',
      meta: {
        csvHeader: 'Bridge type',
      },
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      meta: {
        csvHeader: 'Type',
      },
    }),
    columnHelper.accessor('duration', {
      header: 'Duration',
      cell: ({ row }) => formatTransferDuration(row.original.duration),
      meta: {
        csvHeader: 'Duration',
        getCsvValue: ({ row }) => formatTransferDuration(row.original.duration),
      },
    }),
    columnHelper.accessor('srcTokenAddress', {
      id: 'srcToken',
      header: 'Source token',
      cell: ({ row }) => (
        <TokenCell
          chain={row.original.srcChain}
          symbol={row.original.srcSymbol}
          amount={row.original.srcAmount}
          address={row.original.srcTokenAddress}
          otherSideAbstractTokenId={row.original.dstAbstractTokenId}
        />
      ),
      meta: {
        csvHeader: 'Source token',
        getCsvValue: ({ row }) =>
          formatTokenAmount(row.original.srcSymbol, row.original.srcAmount) ??
          getTokenAddressDisplay(row.original.srcTokenAddress),
      },
    }),
    columnHelper.accessor('srcValueUsd', {
      header: 'Source value',
      cell: ({ row }) => formatDollars(row.original.srcValueUsd),
      meta: {
        csvHeader: 'Source value',
        getCsvValue: ({ row }) => formatDollars(row.original.srcValueUsd),
      },
      sortingFn: (left, right) =>
        (right.original.srcValueUsd ?? 0) - (left.original.srcValueUsd ?? 0),
    }),
    columnHelper.display({
      id: 'srcFlow',
      header: 'Source flow',
      cell: ({ row }) =>
        getTransferSideLabel(row.original.srcWasBurned, 'burned', 'locked'),
      meta: {
        csvHeader: 'Source flow',
        getCsvValue: ({ row }) =>
          getTransferSideLabel(row.original.srcWasBurned, 'burned', 'locked'),
      },
    }),
    columnHelper.accessor('dstTokenAddress', {
      id: 'dstToken',
      header: 'Destination token',
      cell: ({ row }) => (
        <TokenCell
          chain={row.original.dstChain}
          symbol={row.original.dstSymbol}
          amount={row.original.dstAmount}
          address={row.original.dstTokenAddress}
          otherSideAbstractTokenId={row.original.srcAbstractTokenId}
        />
      ),
      meta: {
        csvHeader: 'Destination token',
        getCsvValue: ({ row }) =>
          formatTokenAmount(row.original.dstSymbol, row.original.dstAmount) ??
          getTokenAddressDisplay(row.original.dstTokenAddress),
      },
    }),
    columnHelper.accessor('dstValueUsd', {
      header: 'Destination value',
      cell: ({ row }) => formatDollars(row.original.dstValueUsd),
      meta: {
        csvHeader: 'Destination value',
        getCsvValue: ({ row }) => formatDollars(row.original.dstValueUsd),
      },
      sortingFn: (left, right) =>
        (right.original.dstValueUsd ?? 0) - (left.original.dstValueUsd ?? 0),
    }),
    columnHelper.display({
      id: 'dstFlow',
      header: 'Destination flow',
      cell: ({ row }) =>
        getTransferSideLabel(row.original.dstWasMinted, 'minted', 'released'),
      meta: {
        csvHeader: 'Destination flow',
        getCsvValue: ({ row }) =>
          getTransferSideLabel(row.original.dstWasMinted, 'minted', 'released'),
      },
    }),
    columnHelper.accessor('srcChain', {
      header: 'Source chain',
      meta: {
        csvHeader: 'Source chain',
      },
    }),
    columnHelper.accessor('srcTxHash', {
      header: 'Source tx',
      cell: ({ row }) => (
        <TxCell
          chain={row.original.srcChain}
          hash={row.original.srcTxHash}
          getExplorerUrl={options.getExplorerUrl}
        />
      ),
      enableSorting: false,
      meta: {
        csvHeader: 'Source tx',
        getCsvValue: ({ row }) => row.original.srcTxHash ?? '-',
      },
    }),
    columnHelper.accessor('srcTokenAddress', {
      id: 'srcTokenAddress',
      header: 'Source token address',
      cell: ({ row }) => (
        <TokenAddressCell
          chain={row.original.srcChain}
          address={row.original.srcTokenAddress}
          getExplorerUrl={options.getExplorerUrl}
        />
      ),
      meta: {
        csvHeader: 'Source token address',
        getCsvValue: ({ row }) =>
          getTokenAddressDisplay(row.original.srcTokenAddress),
      },
    }),
    columnHelper.accessor('dstChain', {
      header: 'Destination chain',
      meta: {
        csvHeader: 'Destination chain',
      },
    }),
    columnHelper.accessor('dstTxHash', {
      header: 'Destination tx',
      cell: ({ row }) => (
        <TxCell
          chain={row.original.dstChain}
          hash={row.original.dstTxHash}
          getExplorerUrl={options.getExplorerUrl}
        />
      ),
      enableSorting: false,
      meta: {
        csvHeader: 'Destination tx',
        getCsvValue: ({ row }) => row.original.dstTxHash ?? '-',
      },
    }),
    columnHelper.accessor('dstTokenAddress', {
      id: 'dstTokenAddress',
      header: 'Destination token address',
      cell: ({ row }) => (
        <TokenAddressCell
          chain={row.original.dstChain}
          address={row.original.dstTokenAddress}
          getExplorerUrl={options.getExplorerUrl}
        />
      ),
      meta: {
        csvHeader: 'Destination token address',
        getCsvValue: ({ row }) =>
          getTokenAddressDisplay(row.original.dstTokenAddress),
      },
    }),
  ]
}

function TokenCell(props: {
  chain: string
  symbol: string | undefined
  amount: number | undefined
  address: string | undefined
  otherSideAbstractTokenId: string | undefined
}) {
  const tokenAmount = formatTokenAmount(props.symbol, props.amount)

  if (tokenAmount) {
    return tokenAmount
  }

  const addTokenLink = getAddTokenLinkOptions({
    address: props.address,
    chain: props.chain,
    otherSideAbstractTokenId: props.otherSideAbstractTokenId,
  })

  if (addTokenLink) {
    return (
      <ExternalLink href={addTokenLink.href} className="text-xs">
        {addTokenLink.label}
      </ExternalLink>
    )
  }

  return getTokenAddressDisplay(props.address)
}

function TxCell(props: {
  chain: string
  hash: string | undefined
  getExplorerUrl: (chain: string) => string | undefined
}) {
  if (!props.hash) {
    return <span className="text-muted-foreground">-</span>
  }

  const explorerUrl = props.getExplorerUrl(props.chain)
  const label = shortenHash(props.hash)

  if (!explorerUrl) {
    return <span className="font-mono text-xs">{label}</span>
  }

  return (
    <ExternalLink
      href={`${explorerUrl}/tx/${props.hash}`}
      className="font-mono text-xs"
    >
      {label}
    </ExternalLink>
  )
}

function TokenAddressCell(props: {
  chain: string
  address: string | undefined
  getExplorerUrl: (chain: string) => string | undefined
}) {
  const label = getTokenAddressDisplay(props.address)

  if (
    props.address === undefined ||
    props.address === Address32.NATIVE ||
    props.address === Address32.ZERO
  ) {
    return label
  }

  const explorerUrl = props.getExplorerUrl(props.chain)
  if (!explorerUrl) {
    return <span className="font-mono text-xs">{label}</span>
  }

  const ethAddress = Address32.cropToEthereumAddress(Address32(props.address))

  return (
    <ExternalLink
      href={`${explorerUrl}/address/${ethAddress}`}
      className="font-mono text-xs"
    >
      {label}
    </ExternalLink>
  )
}
