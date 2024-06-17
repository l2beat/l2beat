import { createColumnHelper } from '@tanstack/react-table'
import { type ScalingSummaryActiveEntry } from '../../../_utils/scaling-summary-entry'
import { RosetteCell } from '~/app/_components/rosette/rosette-cell'
import { StageBadge } from '~/app/_components/badge/stage-badge'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { formatNumber } from '~/utils/format-number'
import { EM_DASH } from '~/app/_components/nav/consts'

const columnHelper = createColumnHelper<ScalingSummaryActiveEntry>()

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => ctx.row.index + 1,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('risks', {
    header: 'Risks',
    cell: (ctx) => <RosetteCell values={ctx.getValue()} />,
    enableSorting: false,
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (ctx) => {
      const value = ctx.getValue()
      return <TypeCell>{value}</TypeCell>
    },
  }),
  columnHelper.accessor('stage', {
    header: 'Stage',
    cell: (ctx) => <StageBadge stage={ctx.getValue().stage} />,
  }),
  columnHelper.accessor('purposes', {
    header: 'Purposes',
    cell: (ctx) => ctx.getValue().join(', '),
  }),
  columnHelper.accessor('tvlData.tvl', {
    header: 'Total',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value) {
        return <UpcomingBadge />
      }

      return <span>{formatNumber(value)}</span>
    },
  }),
  columnHelper.accessor('tvlData.marketShare', {
    header: 'Market share',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value) {
        return EM_DASH
      }

      return <span>{formatNumber(value)}%</span>
    },
  }),
]
