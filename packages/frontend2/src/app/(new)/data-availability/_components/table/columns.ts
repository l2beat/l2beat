import { createColumnHelper } from '@tanstack/react-table'
import { formatNumber } from '~/utils/format-number'

export type DataAvailabilityProvider = {
  daLayer: string
  daBridge: { name: string; network: string } | null
  risks: unknown
  layerType: string
  tvs: number
  economicSecurity: number
  usedBy: string[]
}

const columnHelper = createColumnHelper<DataAvailabilityProvider>()

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => ctx.row.index + 1,
  }),
  columnHelper.accessor('daLayer', {
    header: 'DA Layer',
  }),
  columnHelper.accessor('daBridge', {
    header: 'DA Bridge',
    cell: (ctx) =>
      ctx.getValue()
        ? `${ctx.getValue()?.name} on ${ctx.getValue()?.network}`
        : 'No bridge',
  }),
  columnHelper.accessor('risks', {
    cell: () => 'TBD',
  }),
  columnHelper.accessor('layerType', {
    header: 'Layer type',
  }),
  columnHelper.accessor('tvs', {
    header: 'Total value secured',
    cell: (ctx) => `$${formatNumber(ctx.getValue(), 2)}`,
  }),
  columnHelper.accessor('economicSecurity', {
    header: 'Economic security',
    cell: (ctx) => `$${formatNumber(ctx.getValue(), 2)}`,
  }),
  columnHelper.accessor('usedBy', {
    header: 'Used by',
    cell: (ctx) => ctx.getValue().join(', '),
  }),
]
