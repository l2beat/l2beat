import { createColumnHelper } from '@tanstack/react-table'
import { NoInfoCell } from '~/app/_components/table/cells/no-info-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { RiskCell } from '~/app/_components/table/cells/risk-cell'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
import { getCommonProjectColumns } from '~/app/_components/table/common-project-columns'
import { sortSentiments } from '~/app/_components/table/sorting/functions/sentiment-sorting'
import { EM_DASH } from '~/consts/characters'
import { type BridgesSummaryEntry } from '~/server/features/bridges/get-bridge-summary-entries'
import { formatCurrency } from '~/utils/format'
import { formatPercent } from '~/utils/get-percentage-change'

const columnHelper = createColumnHelper<BridgesSummaryEntry>()

const firstHalf = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => (
      <ProjectNameCell
        project={ctx.row.original}
        type={ctx.row.original.type}
      />
    ),
  }),
  columnHelper.accessor('tvl', {
    header: 'Total',
    cell: (ctx) => {
      const entry = ctx.row.original
      return !entry.isUpcoming && entry.tvl !== undefined
        ? formatCurrency(entry.tvl, 'usd')
        : EM_DASH
    },
    meta: {
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago.',
    },
    sortingFn: (a, b) => (a.original.tvl ?? 0) - (b.original.tvl ?? 0),
  }),
]

const secondHalf = [
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
        : sortSentiments(a.original.validatedBy, b.original.validatedBy),
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
]

const marketShareColumn = columnHelper.accessor('bridgesMarketShare', {
  header: 'MKT Share',
  cell: (ctx) =>
    ctx.row.original.bridgesMarketShare !== undefined ? (
      <span>{formatPercent(ctx.row.original.bridgesMarketShare)}</span>
    ) : (
      EM_DASH
    ),
  meta: {
    tooltip: 'Share of the sum of total value locked of all projects.',
  },
})

export const bridgesSummaryActiveColumns = [
  ...firstHalf,
  marketShareColumn,
  ...secondHalf,
]

export const bridgesSummaryArchivedColumns = [...firstHalf, ...secondHalf]
