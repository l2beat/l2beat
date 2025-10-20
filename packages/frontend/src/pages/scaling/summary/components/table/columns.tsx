import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '~/components/badge/Badge'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteCell } from '~/components/rosette/pizza/PizzaRosetteCell'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { StageCell } from '~/components/table/cells/stage/StageCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { sortStages } from '~/components/table/sorting/sortStages'
import { TableLink } from '~/components/table/TableLink'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import type { ScalingSummaryTableRow } from '../../utils/toTableRows'
import { TotalCellWithTvsBreakdown } from './TotalCellWithTvsBreakdown'

const columnHelper = createColumnHelper<ScalingSummaryTableRow>()

interface ScalingSummaryColumnsOpts {
  isTvsLoading?: boolean
}

export function getScalingSummaryColumns(opts?: ScalingSummaryColumnsOpts) {
  return [
    ...getScalingCommonProjectColumns(
      columnHelper,
      (row) => `/scaling/projects/${row.slug}`,
    ),
    columnHelper.display({
      header: 'Risks',
      cell: (ctx) => (
        <PizzaRosetteCell
          href={`/scaling/risk?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
          values={ctx.row.original.risks}
          isUnderReview={ctx.row.original.statuses?.underReview === 'config'}
        />
      ),
      meta: {
        align: 'center',
      },
    }),
    columnHelper.accessor('proofSystem', {
      header: 'Proof system',
      cell: (ctx) => <ProofSystemCell {...ctx.row.original} />,
      meta: {
        tooltip:
          'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
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
            href={`/scaling/projects/${ctx.row.original.slug}#stage`}
            stageConfig={ctx.row.original.stage}
            isAppchain={ctx.row.original.capability === 'appchain'}
            emergencyWarning={ctx.row.original.statuses?.emergencyWarning}
          />
        ),
        sortingFn: sortStages,
        sortUndefined: 'last',
      },
    ),
    columnHelper.accessor(
      (e) => {
        return e.tvs?.breakdown?.total ?? 0
      },
      {
        id: 'total',
        header: 'Total value secured',
        cell: (ctx) => {
          if (opts?.isTvsLoading) {
            return (
              <div className="flex justify-end">
                <Skeleton className="h-6 w-45" />
              </div>
            )
          }
          const value = ctx.row.original.tvs

          return (
            <TotalCellWithTvsBreakdown
              href={`/scaling/tvs?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
              associatedTokens={value.associatedTokens}
              tvsWarnings={value.warnings}
              breakdown={value.breakdown}
              change={value.change?.total}
            />
          )
        },
        meta: {
          align: 'right',
          cellClassName: 'pl-3',
          tooltip:
            'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens, shown together with a percentage change compared to 7D ago.',
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
          <TableLink
            href={`/scaling/activity?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
          >
            <SyncStatusWrapper isSynced={data.isSynced}>
              <ValueWithPercentageChange change={data?.change}>
                {formatActivityCount(ctx.getValue())}
              </ValueWithPercentageChange>
            </SyncStatusWrapper>
          </TableLink>
        )
      },
      sortUndefined: 'last',
      meta: {
        align: 'right',
        tooltip:
          'User operations per second averaged over the past day, shown together with a percentage changed compared to 7D ago.',
      },
    }),
  ]
}

export function getScalingSummaryValidiumAndOptimiumsColumns(
  opts?: ScalingSummaryColumnsOpts,
) {
  return [
    ...getScalingSummaryColumns().slice(0, 5),
    columnHelper.display({
      header: 'DA Layer',
      cell: (ctx) => {
        const latestValue = ctx.row.original.dataAvailability?.[0]
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
            href={`/scaling/data-availability?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
          />
        )
      },
      meta: {
        cellClassName: 'pl-3',
        additionalRows: (ctx) => {
          return (
            ctx.row.original.dataAvailability?.slice(1).map((da) => (
              <TableValueCell
                key={da.layer.value}
                value={{
                  ...da.layer,
                  secondLine:
                    da.bridge.value === 'None' ? 'No bridge' : da.bridge.value,
                }}
                href={`/scaling/data-availability?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
              />
            )) ?? []
          )
        },
      },
    }),
    ...getScalingSummaryColumns(opts).slice(6),
  ]
}

export function getScalingSummaryOthersColumns(
  opts?: ScalingSummaryColumnsOpts,
) {
  return [
    ...getScalingSummaryColumns().slice(0, 4),
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
                  {reason.explanation && (
                    <p className="mb-0.5">{reason.explanation}</p>
                  )}
                  <p>{reason.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )
      },
    }),
    ...getScalingSummaryValidiumAndOptimiumsColumns(opts).slice(5),
  ]
}

export function getScalingSummaryNotReviewedColumns(
  opts?: ScalingSummaryColumnsOpts,
) {
  return [
    ...getScalingCommonProjectColumns(
      columnHelper,
      (row) => `/scaling/projects/${row.slug}`,
      { ignoreUnderReviewIcon: true },
    ),
    ...getScalingSummaryColumns().slice(4, 5),
    ...getScalingSummaryColumns(opts).slice(6, 8),
  ]
}
