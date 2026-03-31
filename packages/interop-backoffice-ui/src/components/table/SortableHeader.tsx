import type { HeaderContext, RowData } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'

interface SortableHeaderProps<TData extends RowData>
  extends HeaderContext<TData, unknown> {
  label: string
}

export function SortableHeader<TData extends RowData>({
  column,
  label,
}: SortableHeaderProps<TData>) {
  const sortState = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      {sortState === 'asc' ? (
        <ArrowUpIcon className="text-primary" />
      ) : sortState === 'desc' ? (
        <ArrowDownIcon className="text-primary" />
      ) : (
        <ArrowUpDownIcon className="opacity-50" />
      )}
    </Button>
  )
}
