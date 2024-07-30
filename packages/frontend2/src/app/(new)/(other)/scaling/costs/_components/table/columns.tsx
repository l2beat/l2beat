import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { type ScalingCostsEntry } from '~/server/features/scaling/get-scaling-costs-entries'
import { CostsTotalCell } from '../costs-total-cell'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { CostsBreakdownValueCell } from '../costs-breakdown-value-cell'
import { EM_DASH } from '~/app/_components/nav/consts'
import { formatNumber } from '~/utils/format-number'
import { getColumnHeaderUnderline } from '~/utils/table/get-column-header-underline'

const columnHelper = createColumnHelper<ScalingCostsEntry>()
const unit = 'usd'

export const scalingCostsColumns = [
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
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('data.total', {
    header: 'Total cost',
    cell: (ctx) => {
      const value = ctx.row.original.data
      if (!value) return <UpcomingBadge />
      return (
        <CostsTotalCell
          data={value}
          unit={unit}
          warning={ctx.row.original.costsWarning}
        />
      )
    },
  }),
  columnHelper.accessor('data.calldata', {
    header: 'Calldata',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value) return EM_DASH
      return <CostsBreakdownValueCell value={value} unit={unit} />
    },
    meta: {
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
      const value = ctx.getValue()
      if (!value) return EM_DASH
      return <CostsBreakdownValueCell value={value} unit={unit} />
    },
    meta: {
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
      const value = ctx.getValue()
      if (!value) return EM_DASH
      return <CostsBreakdownValueCell value={value} unit={unit} />
    },
    meta: {
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
      const value = ctx.getValue()
      if (!value) return EM_DASH
      return <CostsBreakdownValueCell value={value} unit={unit} />
    },
    meta: {
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
      const value = ctx.getValue()
      if (!value) return EM_DASH
      return formatNumber(value)
    },
    meta: {
      align: 'right',
      tooltip: 'Total number of L2 transactions over the selected time period.',
    },
  }),
]
