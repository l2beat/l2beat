import { createColumnHelper } from '@tanstack/react-table'
import { TotalCell } from '~/app/(side-nav)/scaling/summary/_components/table/total-cell'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/pizza-rosette-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { StageCell } from '~/components/table/cells/stage/stage-cell'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/components/table/cells/type-cell'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { sortStages } from '~/components/table/sorting/functions/stage-sorting'
import { formatUops } from '~/utils/number-format/format-tps'
import { type ScalingSummaryTableRow } from '../../_utils/to-table-rows'

const columnHelper = createColumnHelper<ScalingSummaryTableRow>()

export const scalingSummaryColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('risks', {
    cell: (ctx) => (
      <PizzaRosetteCell
        values={ctx.getValue()}
        isUnderReview={ctx.row.original.isUnderReview}
      />
    ),
    enableSorting: false,
    meta: {
      align: 'center',
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
  columnHelper.accessor('stage', {
    cell: (ctx) => <StageCell stageConfig={ctx.getValue()} />,
    sortingFn: sortStages,
    meta: {
      hash: 'stage',
    },
  }),
  columnHelper.accessor(
    (e) => {
      return e.tvl?.breakdown?.total
    },
    {
      id: 'total',
      header: 'Total value locked',
      cell: (ctx) => {
        const value = ctx.row.original.tvl
        if (value.breakdown?.total === undefined) {
          return <NoDataBadge />
        }

        return (
          <TotalCell
            associatedTokenSymbols={value.associatedTokens}
            tvlWarnings={value.warnings}
            breakdown={value.breakdown}
            change={value.change}
          />
        )
      },
      sortUndefined: 'last',
      meta: {
        align: 'right',
        tooltip:
          'Total Value Locked is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens.',
      },
    },
  ),
  columnHelper.accessor('activity.pastDayTps', {
    header: 'Past day TPS',
    cell: (ctx) => {
      const data = ctx.row.original.activity
      if (!data) {
        return <NoDataBadge />
      }

      return (
        <ValueWithPercentageChange change={data.change}>
          {formatUops(ctx.getValue())}
        </ValueWithPercentageChange>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip: 'Transactions per second averaged over the past day.',
    },
  }),
]
