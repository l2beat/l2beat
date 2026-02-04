import { assertUnreachable } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { PrimaryValueCell } from '~/components/table/cells/PrimaryValueCell'
import { EM_DASH } from '~/consts/characters'
import type { AverageDuration } from '~/server/features/scaling/interop/utils/interopEntriesCommon'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { AvgDurationCell } from '../table/AvgDurationCell'

export type TopItem = {
  id: string
  displayName: string
  iconUrl: string
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
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
      <PrimaryValueCell className="font-bold leading-none!">
        {ctx.row.original.displayName}
      </PrimaryValueCell>
    ),
  }),
  columnHelper.accessor('volume', {
    header: 'Last 24h\nVolume',
    cell: (ctx) => {
      if (ctx.row.original.volume === null) return EM_DASH
      return (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.volume, 'usd')}
        </span>
      )
    },
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('transferCount', {
    header: 'Last 24h\ntransfer count',
    cell: (ctx) => (
      <div className="font-medium text-label-value-15">
        {ctx.row.original.transferCount}
      </div>
    ),
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('avgDuration', {
    header: 'Last 24h avg.\ntransfer time',
    cell: (ctx) => {
      if (ctx.row.original.avgDuration === null) return EM_DASH
      return (
        <AvgDurationCell
          averageDuration={ctx.row.original.avgDuration}
          disableTooltip
        />
      )
    },
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('avgValue', {
    header: 'Last 24h avg.\ntransfer value',
    cell: (ctx) => {
      if (ctx.row.original.avgValue === null) return EM_DASH
      return (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.avgValue, 'usd')}
        </span>
      )
    },
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
