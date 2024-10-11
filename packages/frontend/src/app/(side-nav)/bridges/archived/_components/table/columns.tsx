import { createColumnHelper } from '@tanstack/react-table'
import { UpcomingBadge } from '~/components/badge/upcoming-badge'
import { NoInfoCell } from '~/components/table/cells/no-info-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { TypeCell } from '~/components/table/cells/type-cell'
import { sortSentiments } from '~/components/table/sorting/functions/sentiment-sorting'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns'
import { type BridgesArchivedEntry } from '~/server/features/bridges/get-bridges-archived-entries'
import { formatCurrency } from '~/utils/format'

const columnHelper = createColumnHelper<BridgesArchivedEntry>()

export const bridgesArchivedColumns = [
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
  columnHelper.accessor('totalTvl', {
    id: 'total',
    header: 'Total value locked',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (value === undefined) {
        return <UpcomingBadge />
      }

      return (
        <span className="text-xs font-bold md:text-base">
          {formatCurrency(value, 'usd', {
            showLessThanMinimum: false,
          })}
        </span>
      )
    },
    sortingFn: ({ original: a }, { original: b }) => {
      const aTvl = a.totalTvl ?? 0
      const bTvl = b.totalTvl ?? 0

      if (aTvl === bTvl) {
        return b.name.localeCompare(a.name)
      }

      return aTvl - bTvl
    },
    meta: {
      align: 'right',
      tooltip:
        'Total Value Locked is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens.',
    },
  }),
]
