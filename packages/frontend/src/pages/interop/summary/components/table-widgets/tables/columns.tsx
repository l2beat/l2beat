import { type ColumnHelper, createColumnHelper } from '@tanstack/react-table'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { LockMintRow } from './LockMintTable'
import type { NonMintingRow } from './NonMintingTable'
import type { OmniChainRow } from './OmniChainTable'

function getCommonColumns<
  T extends { iconSlug: string; protocolName: string; volume: number },
>(columnHelper: ColumnHelper<T>) {
  return [
    columnHelper.display({
      id: 'logo',
      cell: (ctx) => (
        <img
          className="min-h-[20px] min-w-[20px]"
          src={`/icons/${ctx.row.original.iconSlug}.png`}
          width={20}
          height={20}
          alt={`${ctx.row.original.protocolName} logo`}
        />
      ),
      meta: {
        headClassName: 'w-0',
        cellClassName: 'lg:pr-1.5!',
      },
      size: 28,
      enableHiding: false,
    }),
    columnHelper.accessor((row) => row.protocolName, {
      header: 'Name',
      cell: (ctx) => (
        <span className="font-bold text-label-value-15">
          {ctx.row.original.protocolName}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.volume, {
      header: 'Last 24h\nVolume',
      cell: (ctx) => (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.volume, 'usd')}
        </span>
      ),
    }),
  ]
}

const lockMintColumnHelper = createColumnHelper<LockMintRow>()
export const lockMintColumns = [...getCommonColumns(lockMintColumnHelper)]

const omniChainColumnHelper = createColumnHelper<OmniChainRow>()
export const omniChainColumns = [...getCommonColumns(omniChainColumnHelper)]

const nonMintingColumnHelper = createColumnHelper<NonMintingRow>()
export const nonMintingColumns = [...getCommonColumns(nonMintingColumnHelper)]
