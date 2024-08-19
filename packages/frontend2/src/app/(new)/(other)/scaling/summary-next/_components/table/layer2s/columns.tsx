import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { PizzaRosetteCell } from '~/app/_components/rosette/pizza/pizza-rosette-cell'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { StageCell } from '~/app/_components/table/cells/stage-cell'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/app/_components/table/cells/type-cell'
import { sortStages } from '~/app/_components/table/sorting/functions/stage-sorting'
import { EM_DASH } from '~/consts/characters'
import { formatPercent } from '~/utils/get-percentage-change'
import { type ScalingSummaryTableRow } from '../../../_utils/to-table-rows'
import { TotalCell } from '../total-cell'

const columnHelper = createColumnHelper<ScalingSummaryTableRow>()

export const scalingLayer2sColumns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
    },
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-h-[18px] min-w-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: '!pr-0',
    },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} type="layer2" />,
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
      const value = ctx.getValue()
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
    sortUndefined: 'last',
    meta: {
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
