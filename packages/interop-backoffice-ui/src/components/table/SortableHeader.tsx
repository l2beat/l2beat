import type { HeaderContext, RowData } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'
import { cn } from '~/utils/cn'

interface SortableHeaderProps<TData extends RowData, TValue>
  extends HeaderContext<TData, TValue> {
  label: string
}

export function SortableHeader<TData extends RowData, TValue>({
  column,
  label,
}: SortableHeaderProps<TData, TValue>) {
  const sortState = column.getIsSorted()
  const canBeSorted = column.getCanSort()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('-ml-3', !canBeSorted && 'pointer-events-none')}
      onClick={() =>
        canBeSorted && column.toggleSorting(column.getIsSorted() === 'asc')
      }
    >
      {label}
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
