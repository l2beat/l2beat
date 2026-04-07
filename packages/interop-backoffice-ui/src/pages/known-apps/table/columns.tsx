import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import type { KnownAppsRow } from '../types'

const columnHelper = createColumnHelper<KnownAppsRow>()

export const knownAppsColumns: TableOptions<KnownAppsRow>['columns'] = [
  columnHelper.accessor('plugin', {
    header: 'Plugin',
    meta: {
      csvHeader: 'Plugin',
    },
  }),
  columnHelper.accessor((row) => row.apps.length, {
    id: 'appCount',
    header: 'Known apps',
    cell: ({ getValue }) => getValue(),
    meta: {
      csvHeader: 'Known apps',
      getCsvValue: ({ row }) => String(row.original.apps.length),
    },
  }),
  columnHelper.accessor((row) => row.apps.join(', '), {
    id: 'apps',
    header: 'Apps',
    cell: ({ getValue }) => {
      const value = getValue()

      return (
        <div className="max-w-[56rem] truncate text-sm" title={value}>
          {value}
        </div>
      )
    },
    meta: {
      csvHeader: 'Apps',
    },
  }),
]
