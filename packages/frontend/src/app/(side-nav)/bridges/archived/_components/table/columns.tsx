import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { NoInfoCell } from '~/components/table/cells/no-info-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { TypeCell } from '~/components/table/cells/type-cell'
import { sortBySentiment } from '~/components/table/sorting/functions/sort-by-sentiment'
import { getBridgesCommonProjectColumns } from '~/components/table/utils/common-project-columns/bridges-common-project-columns'
import type { BridgesArchivedEntry } from '~/server/features/bridges/get-bridges-archived-entries'
import { formatCurrency } from '~/utils/number-format/format-currency'

const columnHelper = createColumnHelper<BridgesArchivedEntry>()

export const bridgesArchivedColumns = [
  ...getBridgesCommonProjectColumns(columnHelper),
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
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (ctx) => {
      return <TypeCell>{ctx.getValue()}</TypeCell>
    },
    meta: {
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
    },
  }),
  columnHelper.accessor('totalTvs', {
    id: 'total',
    header: 'Total value secured',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (value === undefined) {
        return <NoDataBadge />
      }

      return (
        <span className="text-xs font-bold md:text-base">
          {formatCurrency(value, 'usd')}
        </span>
      )
    },
    sortingFn: ({ original: a }, { original: b }) => {
      const aTvs = a.totalTvs ?? 0
      const bTvs = b.totalTvs ?? 0

      if (aTvs === bTvs) {
        return b.name.localeCompare(a.name)
      }

      return aTvs - bTvs
    },
    meta: {
      align: 'right',
      tooltip:
        'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens.',
    },
  }),
]
