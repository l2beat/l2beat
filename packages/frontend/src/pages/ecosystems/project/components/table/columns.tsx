import type { ProjectId } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/PizzaRosetteCell'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { StageCell } from '~/components/table/cells/stage/StageCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import {
  TypeExplanationTooltip,
  TypeInfo,
} from '~/components/table/cells/TypeInfo'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { sortStages } from '~/components/table/sorting/sortStages'
import { TableLink } from '~/components/table/TableLink'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import { TotalCellWithTvsBreakdown } from '~/pages/scaling/summary/components/table/TotalCellWithTvsBreakdown'
import type { EcosystemProjectEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'

const columnHelper = createColumnHelper<EcosystemProjectEntry>()

export function getEcosystemProjectsColumns(ecosystemId: ProjectId) {
  return compact([
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
    columnHelper.accessor('category', {
      header: 'Type',
      cell: (ctx) => (
        <TwoRowCell>
          <TwoRowCell.First>
            <TypeInfo stacks={ctx.row.original.stacks}>
              {ctx.getValue()}
            </TypeInfo>
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
    ecosystemId === 'arbitrum-orbit' &&
      columnHelper.accessor('gasTokens', {
        header: 'Gas Tokens',
        cell: (ctx) => {
          const gasTokens = ctx.getValue()
          if (!gasTokens) {
            return <NoDataBadge />
          }
          return <span className="font-medium">{gasTokens.join(', ')}</span>
        },
      }),
    columnHelper.accessor(
      (e) => {
        return e.tvs?.breakdown?.total ?? 0
      },
      {
        id: 'total',
        header: 'Total value secured',
        cell: (ctx) => {
          const value = ctx.row.original.tvs

          return (
            <TotalCellWithTvsBreakdown
              href={`/scaling/tvs?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
              associatedTokenSymbols={value.associatedTokens}
              tvsWarnings={value.warnings}
              breakdown={value.breakdown}
              change={value.change}
            />
          )
        },
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
        tooltip: 'User operations per second averaged over the past day.',
      },
    }),
  ])
}
