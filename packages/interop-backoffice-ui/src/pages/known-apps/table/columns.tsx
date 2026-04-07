import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { KnownAppsRow } from '../types'

const columnHelper = createColumnHelper<KnownAppsRow>()

export const knownAppsColumns: TableOptions<KnownAppsRow>['columns'] = [
  columnHelper.accessor('plugin', {
    header: (props) => <SortableHeader {...props} label="Plugin" />,
    meta: {
      csvHeader: 'Plugin',
    },
  }),
  columnHelper.accessor((row) => row.apps.length, {
    id: 'appCount',
    header: (props) => <SortableHeader {...props} label="Known apps" />,
    cell: ({ getValue }) => getValue(),
    meta: {
      csvHeader: 'Known apps',
      getCsvValue: ({ row }) => String(row.original.apps.length),
    },
  }),
  columnHelper.accessor((row) => row.apps.join(', '), {
    id: 'apps',
    header: (props) => <SortableHeader {...props} label="Apps" />,
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
