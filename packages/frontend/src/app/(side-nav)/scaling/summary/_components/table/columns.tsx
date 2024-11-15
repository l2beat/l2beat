import { createColumnHelper } from '@tanstack/react-table'
import { TotalCell } from '~/app/(side-nav)/scaling/summary/_components/table/total-cell'
import { NoDataBadge } from '~/components/badge/no-data-badge'
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
import { formatTps } from '~/utils/number-format/format-tps'
import { type ScalingSummaryTableRow } from '../../_utils/to-table-rows'
import { UnixTime } from '@l2beat/shared-pure'

const columnHelper = createColumnHelper<ScalingSummaryTableRow>()

export const scalingSummaryColumns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.display({
    header: 'Risks',
    cell: (ctx) => (
      <PizzaRosetteCell
        values={ctx.row.original.risks}
        isUnderReview={ctx.row.original.underReviewStatus === 'config'}
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
  columnHelper.accessor('activity.pastDayTps', {
    header: 'Past day TPS',
    cell: (ctx) => {
      const data = ctx.row.original.activity
      if (!data) {
        return <NoDataBadge />
      }

      return (
        <ValueWithPercentageChange change={data.change}>
          {formatTps(ctx.getValue())}
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

export const scalingSummaryValidiumAndOptimiumsColumns = [
  ...scalingSummaryColumns.slice(0, 4),
  columnHelper.display({
    header: 'DA Layer',
    cell: (ctx) => {
      const now = UnixTime.now()
      const latestValue = ctx.row.original.dataAvailability?.find(
        (entry) =>
          (!entry.sinceTimestamp || entry.sinceTimestamp.lte(now)) &&
          (!entry.untilTimestamp || entry.untilTimestamp.gt(now)),
      )
      if (!latestValue) {
        return <NoDataBadge />
      }
      return (
        <TwoRowCell>
          <TwoRowCell.First>{latestValue.layer.value}</TwoRowCell.First>
          {ctx.row.original.dataAvailability && (
            <TwoRowCell.Second>{latestValue.bridge.value}</TwoRowCell.Second>
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
    id: 'proposer',
    header: 'Proposer',
    cell: (ctx) => {
      const value = ctx.row.original.mainPermissions?.proposer
      if (!value) {
        return <NoDataBadge />
      }

      return (
        <TwoRowCell>
          <TwoRowCell.First>{value.value}</TwoRowCell.First>
          {value.secondLine && (
            <TwoRowCell.Second>{value.secondLine}</TwoRowCell.Second>
          )}
        </TwoRowCell>
      )
    },
  }),
  columnHelper.display({
    id: 'challenger',
    header: 'Challenger',
    cell: (ctx) => {
      const value = ctx.row.original.mainPermissions?.challenger
      if (!value) {
        return <NoDataBadge />
      }

      return (
        <TwoRowCell>
          <TwoRowCell.First>{value.value}</TwoRowCell.First>
          {value.secondLine && (
            <TwoRowCell.Second>{value.secondLine}</TwoRowCell.Second>
          )}
        </TwoRowCell>
      )
    },
  }),
  columnHelper.display({
    id: 'upgrader',
    header: 'Upgrader',
    cell: (ctx) => {
      const value = ctx.row.original.mainPermissions?.upgrader
      if (!value) {
        return <NoDataBadge />
      }

      return (
        <TwoRowCell>
          <TwoRowCell.First>{value.value}</TwoRowCell.First>
          {value.secondLine && (
            <TwoRowCell.Second>{value.secondLine}</TwoRowCell.Second>
          )}
        </TwoRowCell>
      )
    },
  }),
  ...scalingSummaryColumns.slice(6),
]
