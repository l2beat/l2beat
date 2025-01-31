import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/pizza-rosette-cell'
import { TypeExplanationTooltip } from '~/components/table/cells/type-info'
import { TypeInfo } from '~/components/table/cells/type-info'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { EM_DASH } from '~/consts/characters'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
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
      <TypeInfo stack={ctx.row.original.stack}>{ctx.getValue()}</TypeInfo>
    ),
    meta: {
      tooltip: <TypeExplanationTooltip />,
    },
  }),
  columnHelper.display({
    header: 'Purpose',
    cell: (ctx) => ctx.row.original.purposes.join(', '),
  }),
  columnHelper.accessor('totalTvs', {
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
      const aTvs = a.totalTvs ?? 0
      const bTvs = b.totalTvs ?? 0

      if (aTvs === bTvs) {
        return b.name.localeCompare(a.name)
      }

      return aTvs - bTvs
    },
    meta: {
      align: 'right',
      tooltip:
        'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens.',
    },
  }),
]
