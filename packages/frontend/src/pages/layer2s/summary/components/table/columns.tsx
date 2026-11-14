import { formatActivityCount } from '@l2beat/shared-pure'
import { createColumnHelper, type VisibilityState } from '@tanstack/react-table'
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
import { getL2CommonProjectColumns } from '~/components/table/common-project-columns/L2CommonProjectColumns'
import { withChangeSort } from '~/components/table/sorting/changeSortColumn'
import { sortStages } from '~/components/table/sorting/sortStages'
import { TableLink } from '~/components/table/TableLink'
import type { Breakpoint } from '~/hooks/useBreakpoint'
import type { L2SummaryTableRow } from '../../utils/toTableRows'
import { TotalCellWithTvsBreakdown } from './TotalCellWithTvsBreakdown'

const columnHelper = createColumnHelper<L2SummaryTableRow>()

interface L2SummaryColumnsOpts {
  isTvsLoading?: boolean
  /**
   * Hides the descriptive columns with CSS on phones, for the markup painted
   * before the viewport is known. After that the table hides them through
   * its column visibility, which the Columns menu can turn back on.
   */
  hideDescriptiveOnPhones?: boolean
}

/**
 * Descriptive columns that sit between the name and Value secured. Phones
 * start without them, so the figure the tables rank by is in the first view.
 */
const PHONE_HIDDEN_COLUMNS: VisibilityState = {
  proofSystem: false,
  stage: false,
  'DA layer': false,
  'why-am-i-here': false,
}

export function getL2SummaryDefaultVisibility(
  breakpoint: Breakpoint | undefined,
): VisibilityState | undefined {
  return breakpoint === 'xs' || breakpoint === 'sm'
    ? PHONE_HIDDEN_COLUMNS
    : undefined
}

function phoneHiddenMeta(opts: L2SummaryColumnsOpts | undefined) {
  return opts?.hideDescriptiveOnPhones
    ? { headClassName: 'max-md:hidden', cellClassName: 'max-md:hidden' }
    : undefined
}

export function getL2SummaryColumns(opts?: L2SummaryColumnsOpts) {
  return [
    ...getL2CommonProjectColumns(
      columnHelper,
      (row) => `/layer2s/projects/${row.slug}`,
    ),
    columnHelper.display({
      header: 'Risks',
      cell: (ctx) => (
        <PizzaRosetteCell
          projectName={ctx.row.original.name}
          href={`/layer2s/risk?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
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
        ...phoneHiddenMeta(opts),
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
        header: 'Stage',
        cell: (ctx) => (
          <StageCell
            href={`/layer2s/projects/${ctx.row.original.slug}#stage`}
            stageConfig={ctx.row.original.stage}
            isAppchain={ctx.row.original.capability === 'appchain'}
            emergencyWarning={ctx.row.original.statuses?.emergencyWarning}
            walkAway={ctx.row.original.walkAway}
          />
        ),
        sortingFn: sortStages,
        sortUndefined: 'last',
        meta: phoneHiddenMeta(opts),
      },
    ),
    ...withChangeSort(
      columnHelper,
      columnHelper.accessor(
        (e) => {
          return e.tvs?.breakdown?.total ?? 0
        },
        {
          id: 'total',
          header: 'Value secured',
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
                href={`/layer2s/tvs?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
                associatedTokens={value.associatedTokens}
                tvsWarnings={value.warnings}
                breakdown={value.breakdown}
                additionalTrustAssumptionsPercentage={
                  value.additionalTrustAssumptionsPercentage
                }
                change={value.change?.total}
                changePeriod={value.changePeriod}
                syncWarning={value.syncWarning}
              />
            )
          },
          meta: {
            align: 'right',
            // Its right-aligned figures need no lead; the stage column's
            // right padding keeps them apart, so the table fits at 1280.
            // Phones scroll the table sideways: starting the column at its
            // left edge keeps the total in the first view, as on the TVS page.
            headClassName: 'max-md:[&>div]:justify-start',
            cellClassName: 'pl-0 max-md:text-left',
            tooltip:
              'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens, shown together with a percentage change compared to 7 days ago.',
          },
        },
      ),
      (row) => ({
        change: row.tvs?.change?.total,
        period: row.tvs?.changePeriod,
      }),
    ),
    ...withChangeSort(
      columnHelper,
      columnHelper.accessor((row) => row.activity?.pastDayUops, {
        id: 'pastDayUops',
        header: 'UOPS',
        cell: (ctx) => {
          const data = ctx.row.original.activity
          if (!data) {
            return <NoDataBadge />
          }

          return (
            <TableLink
              href={`/layer2s/activity?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
            >
              <SyncStatusWrapper isSynced={data.isSynced}>
                <ValueWithPercentageChange
                  className="font-medium md:text-label-value-15"
                  change={data?.change}
                  changePeriod={data.changePeriod}
                  disabledOnTouch
                >
                  {formatActivityCount(data.pastDayUops)}
                </ValueWithPercentageChange>
              </SyncStatusWrapper>
            </TableLink>
          )
        },
        sortUndefined: 'last',
        meta: {
          align: 'right',
          tooltip:
            'User operations per second averaged over the past day, shown together with a percentage change compared to 7 days ago.',
        },
      }),
      (row) => ({
        change: row.activity?.change,
        period: row.activity?.changePeriod,
      }),
    ),
  ]
}

export function getL2SummaryValidiumAndOptimiumsColumns(
  opts?: L2SummaryColumnsOpts,
) {
  return [
    ...getL2SummaryColumns(opts).slice(0, 6),
    columnHelper.display({
      header: 'DA layer',
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
            href={`/layer2s/risk/data-availability?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
          />
        )
      },
      meta: {
        ...phoneHiddenMeta(opts),
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
                href={`/layer2s/risk/data-availability?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
              />
            )) ?? []
          )
        },
      },
    }),
    ...getL2SummaryColumns(opts).slice(6),
  ]
}

export function getL2SummaryOthersColumns(opts?: L2SummaryColumnsOpts) {
  return [
    ...getL2SummaryColumns(opts).slice(0, 4),
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
      meta: phoneHiddenMeta(opts),
    }),
    ...getL2SummaryValidiumAndOptimiumsColumns(opts).slice(6),
  ]
}
