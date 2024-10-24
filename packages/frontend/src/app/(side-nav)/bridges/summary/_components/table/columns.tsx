import { createColumnHelper } from '@tanstack/react-table'
import { TotalCell } from '~/app/(side-nav)/scaling/summary/_components/table/total-cell'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { NoInfoCell } from '~/components/table/cells/no-info-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { TypeCell } from '~/components/table/cells/type-cell'
import { sortBySentiment } from '~/components/table/sorting/functions/sort-by-sentiment'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns'
import { type BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'

const columnHelper = createColumnHelper<BridgesSummaryEntry>()

export const bridgesSummaryActiveColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('validatedBy', {
    header: 'Validated by',
    cell: (ctx) => {
      const validatedBy = ctx.getValue()

      return validatedBy ? <RiskCell risk={validatedBy} /> : <NoInfoCell />
    },
    meta: {
      tooltip: 'How are the messages sent via this bridge checked?',
    },
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      !a.original.validatedBy || !b.original.validatedBy
        ? -1
        : sortBySentiment(a.original.validatedBy, b.original.validatedBy),
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => {
      return <TypeCell>{ctx.row.original.category}</TypeCell>
    },
    meta: {
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
    },
  }),
  columnHelper.accessor('tvl.breakdown.total', {
    id: 'total',
    header: 'Total',
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
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago.',
    },
  }),
]
