import { createColumnHelper } from '@tanstack/react-table'
import { TotalCell } from '~/app/(side-nav)/scaling/summary/_components/table/total-cell'
import { Badge } from '~/components/badge/badge'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { PizzaRosetteCell } from '~/components/rosette/pizza/pizza-rosette-cell'
import { StageCell } from '~/components/table/cells/stage/stage-cell'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/components/table/cells/type-cell'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { sortStages } from '~/components/table/sorting/functions/stage-sorting'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { type ScalingSummaryTableRow } from '../../_utils/to-table-rows'

const columnHelper = createColumnHelper<ScalingSummaryTableRow>()

export const scalingSummaryColumns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.display({
    header: 'Risks',
    cell: (ctx) => (
      <PizzaRosetteCell
        values={ctx.row.original.risks}
        isUnderReview={ctx.row.original.statuses?.underReview === 'config'}
      />
    ),
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
  columnHelper.accessor(
    (e) => {
      if (
        e.stage?.stage === 'NotApplicable' ||
        e.stage?.stage === 'UnderReview'
      ) {
        return undefined
      }
      return e.stage
    },
    {
      id: 'stage',
      cell: (ctx) => <StageCell stageConfig={ctx.row.original.stage} />,
      sortingFn: sortStages,
      sortUndefined: 'last',
      meta: {
        hash: 'stage',
      },
    },
  ),
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
  columnHelper.accessor('activity.pastDayUops', {
    header: 'Past day UOPS',
    cell: (ctx) => {
      const data = ctx.row.original.activity
      if (!data) {
        return <NoDataBadge />
      }
      return (
        <ValueWithPercentageChange change={data?.change}>
          {formatActivityCount(ctx.getValue())}
        </ValueWithPercentageChange>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip: 'User operations per second averaged over the past day.',
    },
  }),
]

export const scalingSummaryValidiumAndOptimiumsColumns = [
  ...scalingSummaryColumns.slice(0, 5),
  columnHelper.display({
    header: 'DA Layer',
    cell: (ctx) => {
      const latestValue = ctx.row.original.dataAvailability
      if (!latestValue) {
        return <NoDataBadge />
      }
      return (
        <TwoRowCell>
          <TwoRowCell.First>{latestValue.layer.value}</TwoRowCell.First>
          {ctx.row.original.dataAvailability && (
            <TwoRowCell.Second>
              {latestValue.bridge.value === 'None'
                ? 'No bridge'
                : latestValue.bridge.value}
            </TwoRowCell.Second>
          )}
        </TwoRowCell>
      )
    },
  }),
  ...scalingSummaryColumns.slice(6),
]

export const scalingSummaryOthersColumns = [
  ...scalingSummaryColumns.slice(0, 4),
  columnHelper.display({
    id: 'why-am-i-here',
    header: 'Why am I here?',
    cell: (ctx) => {
      const reasons = ctx.row.original.reasonsForBeingOther
      if (!reasons) {
        return <NoDataBadge />
      }
      return (
        <div className="flex gap-1">
          {reasons.map((reason) => (
            <Tooltip key={reason.label}>
              <TooltipTrigger>
                <Badge type="error" className="uppercase">
                  {reason.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{reason.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )
    },
  }),
  ...scalingSummaryValidiumAndOptimiumsColumns.slice(5),
]
