import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { NoInfoCell } from '~/app/_components/table/cells/no-info-cell'
import { NumberCell } from '~/app/_components/table/cells/number-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { RiskCell } from '~/app/_components/table/cells/risk-cell'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
import { sortSentiments } from '~/app/_components/table/sorting/functions/sentiment-sorting'
import { formatPercent } from '~/utils/get-percentage-change'
import { type BridgesSummaryEntry } from '../../../../../../../server/features/bridges/get-bridge-summary-entries'

const columnHelper = createColumnHelper<BridgesSummaryEntry>()

const firstHalf = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
      cellClassName: 'flex items-center',
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
    size: 26,
    meta: {
      headClassName: 'w-0',
      cellClassName: 'lg:!pr-0 pl-2',
    },
  }),
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
      return (
        !entry.isUpcoming &&
        entry.tvlBreakdown && <NumberCell>{entry.tvl?.displayValue}</NumberCell>
      )
    },
    meta: {
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago.',
    },

    sortingFn: (a, b) =>
      (a.original.tvl?.value ?? 0) - (b.original.tvl?.value ?? 0),
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
    ctx.row.original.bridgesMarketShare && (
      <NumberCell>
        <span>{formatPercent(ctx.row.original.bridgesMarketShare)}</span>
      </NumberCell>
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
