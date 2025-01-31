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
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import {
  TypeExplanationTooltip,
  TypeInfo,
} from '~/components/table/cells/type-info'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { sortStages } from '~/components/table/sorting/sort-stages'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { SyncStatusWrapper } from '../../../finality/_components/table/sync-status-wrapper'
import type { ScalingSummaryTableRow } from '../../_utils/to-table-rows'

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
      <TwoRowCell>
        <TwoRowCell.First>
          <TypeInfo stack={ctx.row.original.stack}>{ctx.getValue()}</TypeInfo>
        </TwoRowCell.First>
        {ctx.row.original.capability === 'appchain' && (
          <TwoRowCell.Second>
            {ctx.row.original.purposes.sort().join(', ')}
          </TwoRowCell.Second>
        )}
      </TwoRowCell>
    ),
    meta: {
      tooltip: <TypeExplanationTooltip />,
    },
  }),
  columnHelper.accessor(
    (e) => {
      if (
        e.stage.stage === 'NotApplicable' ||
        e.stage.stage === 'UnderReview'
      ) {
        return undefined
      }
      return e.stage
    },
    {
      id: 'stage',
      cell: (ctx) => (
        <StageCell
          stageConfig={ctx.row.original.stage}
          isAppchain={ctx.row.original.capability === 'appchain'}
        />
      ),
      sortingFn: sortStages,
      sortUndefined: 'last',
      meta: {
        hash: 'stage',
      },
    },
  ),
  columnHelper.accessor(
    (e) => {
      return e.tvs?.breakdown?.total
    },
    {
      id: 'total',
      header: 'Total value secured',
      cell: (ctx) => {
        const value = ctx.row.original.tvs

        return (
          <TotalCell
            associatedTokenSymbols={value.associatedTokens}
            tvsWarnings={value.warnings}
            breakdown={value.breakdown}
            change={value.change}
          />
        )
      },
      sortUndefined: 'last',
      meta: {
        align: 'right',
        tooltip:
          'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens.',
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
        <SyncStatusWrapper isSynced={data.isSynced}>
          <ValueWithPercentageChange change={data?.change}>
            {formatActivityCount(ctx.getValue())}
          </ValueWithPercentageChange>
        </SyncStatusWrapper>
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
        <TableValueCell
          value={{
            ...latestValue.layer,
            secondLine:
              latestValue.bridge.value === 'None'
                ? 'No bridge'
                : latestValue.bridge.value,
          }}
        />
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
