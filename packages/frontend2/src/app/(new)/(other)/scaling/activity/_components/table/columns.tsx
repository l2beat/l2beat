import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { NumberCell } from '~/app/_components/table/cells/number-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { EM_DASH } from '~/consts/characters'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { formatNumber } from '~/utils/format-number'
import { formatTps } from '~/utils/format-tps'
import { MaxTpsCell } from './max-tps-cell'

const columnHelper = createColumnHelper<ScalingActivityEntry>()

export const scalingActivityColumns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
    },
    size: 44.55,
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-h-[18px] min-w-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    size: 26,
    meta: {
      headClassName: 'w-0',
      cellClassName: 'lg:!pr-0',
    },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => (
      <ProjectNameCell
        project={ctx.row.original}
        type={ctx.row.original.type}
      />
    ),
  }),
  columnHelper.accessor('data.pastDayTps', {
    header: 'Past day TPS',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return EM_DASH
      }
      return formatTps(data.pastDayTps)
    },
    sortUndefined: 'last',
    meta: {
      tooltip: 'Transactions per second averaged over the past day.',
    },
  }),
  columnHelper.accessor('data.maxTps.value', {
    header: 'Max TPS',
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return EM_DASH
      }
      return (
        <MaxTpsCell
          maxTps={data.maxTps.value}
          timestamp={data.maxTps.timestamp}
        />
      )
    },
  }),
  columnHelper.accessor('data.summedCount', {
    header: 'Count',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return EM_DASH
      }
      return (
        <div className="flex items-center">
          <NumberCell className="font-bold">
            {formatNumber(data.summedCount)}
          </NumberCell>
          <NumberCell signed className="ml-1 !text-base font-medium">
            {data.change}
          </NumberCell>
        </div>
      )
    },
  }),
  columnHelper.accessor('dataSource', {
    header: 'Data source',
  }),
]
