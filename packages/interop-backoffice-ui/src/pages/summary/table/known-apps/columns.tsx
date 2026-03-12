import type { ColumnDef } from '@tanstack/react-table'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { SummaryKnownAppsRow } from '../types'

export const knownAppsColumns: ColumnDef<SummaryKnownAppsRow>[] = [
  {
    accessorKey: 'plugin',
    header: (props) => <SortableHeader {...props} label="Plugin" />,
    meta: {
      csvHeader: 'Plugin',
    },
  },
  {
    id: 'appsCount',
    accessorFn: (row) => row.apps.length,
    header: (props) => <SortableHeader {...props} label="Apps count" />,
    meta: {
      csvHeader: 'Apps count',
    },
  },
  {
    id: 'apps',
    accessorFn: (row) => row.apps.join(', '),
    header: (props) => <SortableHeader {...props} label="Known apps" />,
    cell: ({ row }) => {
      if (row.original.apps.length === 0) {
        return '-'
      }

      return (
        <div className="max-w-[900px] whitespace-normal break-words text-xs">
          {row.original.apps.join(', ')}
        </div>
      )
    },
    meta: {
      csvHeader: 'Known apps',
      csvValue: ({ row }) => row.original.apps.join(', '),
    },
  },
]
