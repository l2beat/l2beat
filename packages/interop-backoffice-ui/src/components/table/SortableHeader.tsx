import { flexRender, type Header, type RowData } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'
import { cn } from '~/utils/cn'

export function SortableHeader<TData extends RowData, TValue>({
  header,
}: {
  header: Header<TData, TValue>
}) {
  const sortState = header.column.getIsSorted()
  const canBeSorted = header.column.getCanSort()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('-ml-3', !canBeSorted && 'pointer-events-none')}
      onClick={() => canBeSorted && header.column.toggleSorting()}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {canBeSorted && (
        <div>
          {sortState === 'asc' ? (
            <ArrowUpIcon className="text-primary" />
          ) : sortState === 'desc' ? (
            <ArrowDownIcon className="text-primary" />
          ) : (
            <ArrowUpDownIcon className="opacity-50" />
          )}
        </div>
      )}
    </Button>
  )
}
