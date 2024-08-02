import { assertUnreachable } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { EM_DASH } from '~/app/_components/nav/consts'
import { Skeleton } from '~/app/_components/skeleton'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import {
  type CostsUnit,
  type ScalingCostsEntry,
} from '~/server/features/scaling/get-scaling-costs-entries'
import { type SyncStatus } from '~/types/SyncStatus'
import { formatNumber } from '~/utils/format-number'
import { getColumnHeaderUnderline } from '~/utils/table/get-column-header-underline'
import { CostsBreakdownValueCell } from '../costs-breakdown-value-cell'
import { CostsTotalCell } from '../costs-total-cell'

export type ScalingCostsTableEntry = ScalingCostsEntry & {
  data: CostsAvailableData | CostsNotAvailableData
}

export type CostsAvailableData = {
  type: 'available'
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
  txCount: number | undefined
  unit: CostsUnit
  syncStatus: SyncStatus
}
type CostsNotAvailableData = {
  type: 'not-available'
  reason: 'loading' | 'coming-soon' | 'no-tx-count'
  syncStatus?: never
}

const columnHelper = createColumnHelper<ScalingCostsTableEntry>()

export const scalingCostsColumns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      hash: 'costs',
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
      hash: 'costs',
      headClassName: 'w-0',
      cellClassName: 'lg:!pr-0',
    },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('data.total', {
    header: 'Total cost',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (data.type === 'available') {
        return (
          <CostsTotalCell data={data} warning={ctx.row.original.costsWarning} />
        )
      }

      switch (data.reason) {
        case 'loading':
          return <Skeleton className="h-8 w-full" />
        case 'coming-soon':
          return <UpcomingBadge />
        case 'no-tx-count':
          return EM_DASH
        default:
          assertUnreachable(data.reason)
      }
    },
    meta: {
      hash: 'costs',
    },
  }),
  columnHelper.accessor('data.calldata', {
    header: 'Calldata',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (data.type === 'available') {
        return (
          <CostsBreakdownValueCell value={data.calldata} unit={data.unit} />
        )
      }

      switch (data.reason) {
        case 'loading':
          return <Skeleton className="ml-auto h-6 w-20" />
        case 'coming-soon':
        case 'no-tx-count':
          return EM_DASH
        default:
          assertUnreachable(data.reason)
      }
    },
    meta: {
      hash: 'costs',
      align: 'right',
      headClassName: getColumnHeaderUnderline(
        'w-[132px]',
        'before:bg-sky-550',
        'dark:before:bg-sky-500',
      ),
      tooltip:
        'The cost for posting data as calldata on Ethereum for the selected time period. Shows a sum or an average per L2 transaction, depending on the selected option.',
    },
  }),
  columnHelper.accessor('data.blobs', {
    header: 'Blobs',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (data.type === 'available') {
        return <CostsBreakdownValueCell value={data.blobs} unit={data.unit} />
      }

      switch (data.reason) {
        case 'loading':
          return <Skeleton className="ml-auto h-6 w-20" />
        case 'coming-soon':
        case 'no-tx-count':
          return EM_DASH
        default:
          assertUnreachable(data.reason)
      }
    },
    meta: {
      hash: 'costs',
      align: 'right',
      headClassName: getColumnHeaderUnderline(
        'w-[132px]',
        'before:bg-orange-400',
        'dark:before:bg-yellow-100',
      ),
      tooltip:
        'The cost for posting data as blobs on Ethereum for the selected time period. Shows a sum or an average per L2 transaction, depending on the selected option.',
    },
  }),
  columnHelper.accessor('data.compute', {
    header: 'Compute',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (data.type === 'available') {
        return <CostsBreakdownValueCell value={data.compute} unit={data.unit} />
      }

      switch (data.reason) {
        case 'loading':
          return <Skeleton className="ml-auto h-6 w-20" />
        case 'coming-soon':
        case 'no-tx-count':
          return EM_DASH
        default:
          assertUnreachable(data.reason)
      }
    },
    meta: {
      hash: 'costs',
      align: 'right',
      headClassName: getColumnHeaderUnderline(
        'w-[132px]',
        'before:bg-pink-100',
      ),
      tooltip:
        'The cost for carrying out different operations within a transaction for the selected time period. Shows a sum or an average per L2 transaction, depending on the selected option.',
    },
  }),
  columnHelper.accessor('data.overhead', {
    header: 'Overhead',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (data.type === 'available') {
        return (
          <CostsBreakdownValueCell value={data.overhead} unit={data.unit} />
        )
      }

      switch (data.reason) {
        case 'loading':
          return <Skeleton className="ml-auto h-6 w-20" />
        case 'coming-soon':
        case 'no-tx-count':
          return EM_DASH
        default:
          assertUnreachable(data.reason)
      }
    },
    meta: {
      hash: 'costs',
      align: 'right',
      headClassName: getColumnHeaderUnderline(
        'w-[132px]',
        'before:bg-purple-100',
      ),
      tooltip:
        'The cost of the fixed 21,000 GAS overhead per L1 transaction for the selected time period. Shows a sum or an average per L2 transaction, depending on the selected option.',
    },
  }),
  columnHelper.accessor('data.txCount', {
    header: 'L2 Tx count',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (data.type === 'available') {
        const value = data.txCount
        if (!value) return EM_DASH
        return formatNumber(value)
      }

      switch (data.reason) {
        case 'loading':
          return <Skeleton className="ml-auto h-6 w-24" />
        case 'coming-soon':
        case 'no-tx-count':
          return EM_DASH
        default:
          assertUnreachable(data.reason)
      }
    },
    meta: {
      hash: 'costs',
      align: 'right',
      tooltip: 'Total number of L2 transactions over the selected time period.',
    },
  }),
]
