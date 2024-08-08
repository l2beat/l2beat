import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { NumberCell } from '~/app/_components/table/cells/number-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { formatNumber } from '~/utils/format-number'
import { Skeleton } from '~/app/_components/skeleton'
import { EM_DASH } from '~/app/_components/nav/consts'
import { formatTps } from '~/utils/format-tps'
import { type SyncStatus } from '~/types/SyncStatus'

export type ScalingActivityTableEntry = ScalingActivityEntry & {
  data: ActivityData
}

export type ActivityData = AvailableActivityData | NotAvailableActivityData

type AvailableActivityData = {
  type: 'available'
  change: number
  summedCount: number
  pastDayTps: number
  maxTps: {
    value: number
    timestamp: number
  }
  syncStatus: SyncStatus
}
type NotAvailableActivityData = {
  type: 'not-available'
  reason: 'missing-data' | 'loading'
  syncStatus?: never
}

const columnHelper = createColumnHelper<ScalingActivityTableEntry>()

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
      if (data.type === 'not-available') {
        switch (data.reason) {
          case 'missing-data':
            return EM_DASH
          case 'loading':
            return <Skeleton className="h-4 w-10" />
        }
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
      if (data.type === 'not-available') {
        switch (data.reason) {
          case 'missing-data':
            return EM_DASH
          case 'loading':
            return <Skeleton className="h-4 w-10" />
        }
      }
      return formatTps(data.maxTps.value)
    },
  }),
  columnHelper.accessor('data.summedCount', {
    header: 'Count',
    cell: (ctx) => {
      if (ctx.row.original.data.type === 'not-available') {
        switch (ctx.row.original.data.reason) {
          case 'missing-data':
            return EM_DASH
          case 'loading':
            return <Skeleton className="h-4 w-10" />
        }
      }
      return (
        <div className="flex items-center">
          <NumberCell className="font-bold">
            {formatNumber(ctx.row.original.data.summedCount)}
          </NumberCell>
          <NumberCell signed className="ml-1 !text-base font-medium">
            {ctx.row.original.data.change}
          </NumberCell>
        </div>
      )
    },
  }),
  columnHelper.accessor('dataSource', {
    header: 'Data source',
  }),
]
