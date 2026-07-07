import { formatAddress, formatSeconds } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { CopyButton } from '~/components/CopyButton'
import { CustomLink } from '~/components/link/CustomLink'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { IndexCell } from '~/components/table/cells/IndexCell'
import { InteropNoDataBadge } from '~/pages/interop/components/InteropNoDataBadge'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { InteropTokenOnchainDeploymentsRow } from './InteropTokenOnchainDeploymentsSection'

const UNSUPPORTED_CHAIN_TOOLTIP =
  "The information is not available as this deployment is on a chain we don't fully support yet."
const NO_TRANSFER_TIME_TOOLTIP =
  'There is no transfer time data for this deployment from the past 24 hours.'

export type DeploymentRow = InteropTokenOnchainDeploymentsRow & BasicTableRow
const columnHelper = createColumnHelper<DeploymentRow>()
export const interopTokenOnchainDeploymentsColumns = [
  columnHelper.accessor((_, index) => index + 1, {
    id: 'index',
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    enableSorting: false,
    meta: {
      headClassName: 'w-0',
    },
    size: 44,
  }),
  columnHelper.accessor((row) => row.chain.name, {
    id: 'chain',
    header: 'Chain',
    cell: (ctx) => {
      const chain = ctx.row.original.chain
      return (
        <div className="flex items-center gap-2 whitespace-nowrap font-bold">
          {chain.iconUrl && (
            <img
              className="size-5 rounded-full bg-white shadow"
              src={chain.iconUrl}
              width={20}
              height={20}
              alt={`${chain.name} icon`}
            />
          )}
          <span className="capitalize">{chain.name}</span>
        </div>
      )
    },
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    enableSorting: false,
    cell: (ctx) => {
      const { address, explorerUrl } = ctx.row.original
      const label = formatAddress(address)
      if (!explorerUrl) {
        return <span className="font-medium text-label-value-15">{label}</span>
      }
      return (
        <div className="flex items-center gap-1">
          <CustomLink href={explorerUrl} className="text-label-value-15">
            {label}
          </CustomLink>
          <CopyButton
            toCopy={address}
            iconClassName="size-3 fill-secondary"
            copyText="Copy address"
          />
        </div>
      )
    },
  }),
  columnHelper.accessor('symbol', {
    header: 'Symbol',
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {ctx.row.original.symbol}
      </span>
    ),
  }),
  columnHelper.accessor('volume', {
    header: 'Last 24h\nVolume',
    cell: (ctx) => {
      if (ctx.row.original.volume === null)
        return <InteropNoDataBadge tooltip={UNSUPPORTED_CHAIN_TOOLTIP} />
      return (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.volume, 'usd')}
        </span>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'The total USD value of all transfers involving this deployment in the past 24 hours.',
    },
  }),
  columnHelper.accessor('transferCount', {
    header: 'Last 24h\ntransfer count',
    cell: (ctx) => {
      if (ctx.row.original.transferCount === null)
        return <InteropNoDataBadge tooltip={UNSUPPORTED_CHAIN_TOOLTIP} />
      return (
        <span className="font-medium text-label-value-15">
          {ctx.row.original.transferCount}
        </span>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'The total number of transfers involving this deployment in the past 24 hours.',
    },
  }),
  columnHelper.accessor('avgDuration', {
    header: 'Last 24h avg.\ntransfer time',
    cell: (ctx) => {
      if (ctx.row.original.avgDuration === null) {
        return (
          <InteropNoDataBadge
            tooltip={
              !ctx.row.original.isSupported
                ? UNSUPPORTED_CHAIN_TOOLTIP
                : NO_TRANSFER_TIME_TOOLTIP
            }
          />
        )
      }
      return (
        <span className="font-medium text-label-value-15">
          {formatSeconds(ctx.row.original.avgDuration)}
        </span>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'The average time it takes for a transfer involving this deployment to be received on the destination chain, measured over the past 24 hours.',
    },
  }),
]
