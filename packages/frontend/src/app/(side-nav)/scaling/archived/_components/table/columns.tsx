import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/pizza-rosette-cell'
import { TypeExplanationTooltip } from '~/components/table/cells/type-cell'
import { TypeCell } from '~/components/table/cells/type-cell'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { EM_DASH } from '~/consts/characters'
import { type ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { formatDollarValueNumber } from '~/utils/number-format/format-dollar-value-number'

const columnHelper = createColumnHelper<ScalingArchivedEntry>()

export const scalingArchivedColumns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.display({
    header: 'Risks',
    cell: (ctx) => {
      const risks = ctx.row.original.risks
      if (!risks) {
        return EM_DASH
      }

      return (
        <PizzaRosetteCell
          values={risks}
          isUnderReview={ctx.row.original.statuses?.underReview === 'config'}
        />
      )
    },
    meta: {
      cellClassName: 'justify-center',
    },
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => (
      <TypeCell provider={ctx.row.original.provider}>{ctx.getValue()}</TypeCell>
    ),
    meta: {
      tooltip: <TypeExplanationTooltip />,
    },
  }),
  columnHelper.display({
    header: 'Purpose',
    cell: (ctx) => ctx.row.original.purposes.join(', '),
  }),
  columnHelper.accessor('totalTvl', {
    id: 'total',
    header: 'Total value secured',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (value === undefined) {
        return <NoDataBadge />
      }

      return (
        <span className="font-bold md:text-base">
          {formatDollarValueNumber(value)}
        </span>
      )
    },
    sortingFn: ({ original: a }, { original: b }) => {
      const aTvl = a.totalTvl ?? 0
      const bTvl = b.totalTvl ?? 0

      if (aTvl === bTvl) {
        return b.name.localeCompare(a.name)
      }

      return aTvl - bTvl
    },
    meta: {
      align: 'right',
      tooltip:
        'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens.',
    },
  }),
]
