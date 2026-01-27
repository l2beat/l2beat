import { assertUnreachable, formatSeconds } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export type TopItem = {
  id: string
  displayName: string
  iconUrl: string
  volume: number
  transferCount: number
  avgDuration: number
  avgValue: number
}
export type TopItemType = 'tokens' | 'chains'

export type TopItemRow = TopItem & BasicTableRow
const columnHelper = createColumnHelper<TopItemRow>()

export const getTopItemsColumns = (itemType: TopItemType) => [
  columnHelper.display({
    id: 'icon',
    cell: (ctx) => (
      <img
        className="min-h-[20px] min-w-[20px] rounded-full bg-white shadow"
        src={ctx.row.original.iconUrl}
        width={20}
        height={20}
        alt={`${ctx.row.original.displayName} icon`}
      />
    ),
    meta: {
      headClassName: 'w-0 pr-0!',
      cellClassName: 'pr-0!',
    },
    size: 28,
    enableHiding: false,
  }),
  columnHelper.accessor('displayName', {
    header: itemTypeToHeader(itemType),
    cell: (ctx) => (
      <div className="font-medium text-label-value-13">
        {ctx.row.original.displayName}
      </div>
    ),
  }),
  columnHelper.accessor('volume', {
    header: 'Volume',
    cell: (ctx) => (
      <span className="font-medium text-label-value-13">
        {formatCurrency(ctx.row.original.volume, 'usd')}
      </span>
    ),
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('transferCount', {
    header: 'Transfer Count',
    cell: (ctx) => (
      <div className="font-medium text-label-value-13">
        {ctx.row.original.transferCount}
      </div>
    ),
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('avgDuration', {
    header: 'Avg Duration',
    cell: (ctx) => (
      <span className="font-medium text-label-value-13">
        {formatSeconds(ctx.row.original.avgDuration)}
      </span>
    ),
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('avgValue', {
    header: 'Avg Value',
    cell: (ctx) => (
      <span className="font-medium text-label-value-13">
        {formatCurrency(ctx.row.original.avgValue, 'usd')}
      </span>
    ),
  }),
]

const itemTypeToHeader = (itemType: TopItemType) => {
  switch (itemType) {
    case 'tokens':
      return 'Symbol'
    case 'chains':
      return 'Chain'
    default:
      assertUnreachable(itemType)
  }
}
