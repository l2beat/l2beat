import { createColumnHelper } from '@tanstack/react-table'
import { type DaSummaryEntry } from '~/server/features/data-availability/get-da-summary-entries'
import { formatNumber } from '~/utils/format-number'
import { DaEconomicSecurityCell } from './da-economic-security-cell'
import { mapRisksToRosetteValues } from '../../../_utils/map-risks-to-rosette-values'
import { PentagonRosetteCell } from '~/app/_components/rosette/pentagon/pentagon-rosette-cell'
import { UsedIn } from './used-in'
import { EM_DASH } from '~/app/_components/nav/consts'

const columnHelper = createColumnHelper<DaSummaryEntry>()

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => ctx.row.index + 1,
  }),
  columnHelper.accessor('daLayer', {
    header: 'DA Layer',
  }),
  columnHelper.accessor('daBridge.name', {
    header: 'DA Bridge',
  }),
  columnHelper.accessor('risks', {
    header: 'Risks',
    cell: (ctx) => (
      <PentagonRosetteCell
        values={mapRisksToRosetteValues(ctx.getValue())}
        isUnderReview={ctx.row.original.isUnderReview}
      />
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
    cell: (ctx) => <DaEconomicSecurityCell value={ctx.getValue()} />,
  }),
  columnHelper.accessor('usedIn', {
    header: 'Used in',
    cell: (ctx) => {
      const value = ctx.getValue()
      return value.length > 0 ? <UsedIn usedIn={value} /> : EM_DASH
    },
    enableSorting: false,
  }),
]
