import { createColumnHelper } from '@tanstack/react-table'
import { RosetteCell } from '~/app/_components/rosette/rosette-cell'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { EM_DASH } from '~/app/_components/nav/consts'
import { sortStages } from '~/app/_components/table/sorting/functions/stage-sorting'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { StageCell } from '~/app/_components/table/cells/stage-cell'
import { type ScalingSummaryLayer2sEntry } from '~/server/features/scaling/get-scaling-summary-entries'
import { formatPercent } from '~/utils/get-percentage-change'
import { TotalCell } from './total-cell'

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
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} type="layer2" />,
  }),
  columnHelper.accessor('risks', {
    cell: (ctx) => <RosetteCell values={ctx.getValue()} />,
    enableSorting: false,
  }),
  columnHelper.accessor('type', {
    cell: (ctx) => {
      const value = ctx.getValue()
      return <TypeCell provider={value.provider}>{value.category}</TypeCell>
    },
  }),
  columnHelper.accessor('stage', {
    cell: (ctx) => <StageCell stageConfig={ctx.getValue()} />,
    sortingFn: sortStages,
  }),
  columnHelper.accessor('purposes', {
    header: 'Purpose',
    cell: (ctx) => ctx.getValue().join(', '),
    enableSorting: false,
  }),
  columnHelper.accessor('tvlData', {
    id: 'total',
    header: 'Total',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value) {
        return <UpcomingBadge />
      }

      return <TotalCell data={value} />
    },
    meta: {
      headClassName: 'justify-end',
      cellClassName: 'justify-end',
    },
  }),
  columnHelper.accessor('tvlData.marketShare', {
    header: 'Market share',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value) {
        return EM_DASH
      }

      return formatPercent(value)
    },
    meta: {
      headClassName: 'justify-end',
      cellClassName: 'justify-end',
    },
  }),
]
