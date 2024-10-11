import { createColumnHelper } from '@tanstack/react-table'
import { TotalCell } from '~/app/(side-nav)/scaling/summary/_components/table/total-cell'
import { UpcomingBadge } from '~/components/badge/upcoming-badge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/pizza-rosette-cell'
import { NumberCell } from '~/components/table/cells/number-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { StageCell } from '~/components/table/cells/stage/stage-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { sortStages } from '~/components/table/sorting/functions/stage-sorting'
import { EM_DASH } from '~/consts/characters'
import { formatNumber } from '~/utils/format-number'
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
      headClassName: 'w-0',
    },
  }),
  columnHelper.accessor('stateValidation', {
    header: 'Proof system',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} colorful={false} />,
    enableSorting: false,
  }),
  columnHelper.accessor('stage', {
    cell: (ctx) => <StageCell stageConfig={ctx.getValue()} />,
    sortingFn: sortStages,
    meta: {
      hash: 'stage',
    },
  }),
  columnHelper.accessor('tvl', {
    id: 'total',
    header: 'Total value locked',
    cell: (ctx) => {
      const value = ctx.row.original.tvl
      if (!value.breakdown) {
        return <UpcomingBadge />
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
    sortingFn: ({ original: a }, { original: b }) => {
      const aTvl = a.tvl.breakdown?.total ?? 0
      const bTvl = b.tvl.breakdown?.total ?? 0

      if (aTvl === bTvl) {
        return b.name.localeCompare(a.name)
      }

      return aTvl - bTvl
    },
    meta: {
      align: 'right',
      tooltip:
        'Total Value Locked is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens.',
    },
  }),
  columnHelper.accessor('activity.pastDayTps', {
    header: 'Past day TPS',
    cell: (ctx) => {
      const data = ctx.row.original.activity
      if (!data) {
        return EM_DASH
      }
      return (
        <div className="flex items-center">
          <NumberCell className="font-bold">
            {formatNumber(ctx.getValue())}
          </NumberCell>
          <NumberCell signed className="ml-1 font-medium">
            {data.change}
          </NumberCell>
        </div>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip: 'Transactions per second averaged over the past day.',
    },
  }),
]
