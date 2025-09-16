import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { getBridgesCommonProjectColumns } from '~/components/table/utils/common-project-columns/BridgesCommonProjectColumns'
import type { BridgesArchivedEntry } from '~/server/features/bridges/getBridgesArchivedEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

const columnHelper = createColumnHelper<BridgesArchivedEntry>()

export function getBridgesArchivedColumns(isOthers?: boolean) {
  return compact([
    ...getBridgesCommonProjectColumns(
      columnHelper,
      (row) => `/bridges/projects/${row.slug}`,
    ),
    columnHelper.accessor((e) => adjustTableValue(e.validatedBy), {
      header: 'Validated by',
      cell: (ctx) => <TableValueCell value={ctx.row.original.validatedBy} />,
      meta: {
        tooltip: 'How are the messages sent via this bridge checked?',
      },
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(a.original.validatedBy, b.original.validatedBy),
    }),
    isOthers &&
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (ctx) => <span>{ctx.getValue()}</span>,
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
          <span className="font-bold text-xs md:text-base">
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
          'Total value secured in contracts on Ethereum, shown together with a percentage change compared to 7D ago.',
      },
    }),
  ])
}
