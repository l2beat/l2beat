import { createColumnHelper } from '@tanstack/react-table'
import { type ScalingSummaryLayer2sEntry } from '../../../_utils/scaling-summary-entry'
import { RosetteCell } from '~/app/_components/rosette/rosette-cell'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { formatNumber } from '~/utils/format-number'
import { EM_DASH } from '~/app/_components/nav/consts'
import { sortStages } from '~/app/_components/table/sorting/functions/stage-sorting'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { StageCell } from '~/app/_components/table/cells/stage-cell'

const columnHelper = createColumnHelper<ScalingSummaryLayer2sEntry>()

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell index={ctx.row.index} />,
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-w-[18px] min-h-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: { cellClassName: '!pr-0' },
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
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
    cell: (ctx) => <StageCell stageConfig={ctx.getValue()} />,
    sortingFn: sortStages,
  }),
  columnHelper.accessor('purposes', {
    header: 'Purpose',
    cell: (ctx) => ctx.getValue().join(', '),
    enableSorting: false,
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
