import { createColumnHelper } from '@tanstack/react-table'
import { UpcomingBadge } from '~/components/badge/upcoming-badge'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/components/table/cells/type-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { type ScalingSummaryTableRow } from '../../../_utils/to-table-rows'
import { TotalCell } from '../total-cell'

const columnHelper = createColumnHelper<ScalingSummaryTableRow>()

export const summaryLayer3sColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} type="layer2" />,
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => <TypeCell>{ctx.getValue()}</TypeCell>,
    meta: {
      tooltip: <TypeExplanationTooltip />,
    },
    sortingFn: (rowA, rowB) => {
      // Sort by category first, then by provider
      const categoryComparison = (rowA.original.category ?? '').localeCompare(rowB.original.category ?? '');
      return categoryComparison !== 0 ? categoryComparison :
        (rowA.original.provider ?? '').localeCompare(rowB.original.provider ?? '');
    },
  }),
  columnHelper.accessor('provider', {
    header: 'Technology',
    cell: (ctx) => {
      const value = ctx.getValue()
      return value === 'Arbitrum' ? 'Arbitrum Orbit' : value
    },
    meta: {
      tooltip: 'The technology stack used.',
    },
  }),
  columnHelper.accessor('hostChain', {
    header: 'Host chain',
    meta: {
      tooltip: 'The technology stack used.',
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
        'Total value locked in escrow contracts on the base chain displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
    },
  }),
]
