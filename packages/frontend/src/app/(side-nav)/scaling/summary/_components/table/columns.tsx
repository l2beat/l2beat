import { createColumnHelper } from '@tanstack/react-table'
import { UpcomingBadge } from '~/components/badge/upcoming-badge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/pizza-rosette-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { StageCell } from '~/components/table/cells/stage/stage-cell'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/components/table/cells/type-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { sortStages } from '~/components/table/sorting/functions/stage-sorting'
import { EM_DASH } from '~/consts/characters'
import { formatPercent } from '~/utils/get-percentage-change'
import { type ScalingSummaryTableRow } from '../../_utils/to-table-rows'
import { TotalCell } from './total-cell'

const columnHelper = createColumnHelper<ScalingSummaryTableRow>()

export const scalingLayer2sColumns = [
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
      cellClassName: 'justify-center',
      tooltip: 'Risks associated with this project.',
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
      tooltip: 'Rollup stage based on its features and maturity.',
      hash: 'stage',
    },
  }),
  columnHelper.accessor('purposes', {
    header: 'Purpose',
    cell: (ctx) => ctx.getValue().join(', '),
    enableSorting: false,
    meta: {
      tooltip: 'Functionality supported by this project.',
    },
  }),
  columnHelper.accessor('tvl', {
    id: 'total',
    header: 'Total',
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
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
    },
  }),
  columnHelper.accessor((e) => e.marketShare, {
    header: 'Mkt Share',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value) {
        return EM_DASH
      }

      return formatPercent(value)
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip: 'Share of the sum of total value locked of all projects.',
    },
  }),
]
