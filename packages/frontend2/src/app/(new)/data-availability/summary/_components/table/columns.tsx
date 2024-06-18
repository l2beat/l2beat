import { createColumnHelper } from '@tanstack/react-table'
import { EM_DASH } from '~/app/_components/nav/consts'
import { RosetteCell } from '~/app/_components/rosette/rosette-cell'
import { formatNumber } from '~/utils/format-number'
import { mapRisksToRosetteValues as mapDaRisksToRosetteValues } from '../../../_utils/get-da-risks'
import { type DaSummaryEntry } from '../../_utils/da-summary-entry'
import { DaBridgeCell } from './da-bridge-cell'

const columnHelper = createColumnHelper<DaSummaryEntry>()

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
    cell: (ctx) => <DaBridgeCell daBridge={ctx.getValue()} />,
  }),
  columnHelper.accessor('risks', {
    header: 'Risks',
    cell: (ctx) => (
      <RosetteCell values={mapDaRisksToRosetteValues(ctx.getValue())} />
    ),
    enableSorting: false,
    meta: {
      hash: 'risk-analysis',
    },
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
    cell: (ctx) => {
      const value = ctx.getValue()
      return value.length > 0 ? value.join(', ') : EM_DASH
    },
    enableSorting: false,
  }),
]
