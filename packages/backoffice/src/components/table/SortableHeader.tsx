import { flexRender, type Header, type RowData } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'

export function SortableHeader<TData extends RowData, TValue>({
  header,
}: {
  header: Header<TData, TValue>
}) {
  const sortState = header.column.getIsSorted()
  const canBeSorted = header.column.getCanSort()

  const body = header.isPlaceholder
    ? null
    : flexRender(header.column.columnDef.header, header.getContext())

  if (canBeSorted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => header.column.toggleSorting()}
      >
        {body}
        <div>
          {sortState === 'asc' ? (
            <ArrowUpIcon className="text-primary" />
          ) : sortState === 'desc' ? (
            <ArrowDownIcon className="text-primary" />
          ) : (
            <ArrowUpDownIcon className="opacity-50" />
          )}
        </div>
      </Button>
    )
  }

  return body
}
