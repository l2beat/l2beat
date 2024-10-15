'use client'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useServerPagination } from '~/lib/server-pagination/client'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'

export function TableControls({
  count,
  limits = [10, 20, 50, 100],
}: { count: number; limits?: number[] }) {
  if (limits.length === 0) throw new Error('No limits provided')

  const { page, pageCount, setPage, limit, setLimit } = useServerPagination(
    count,
    limits,
  )

  return (
    <div className="flex items-center flex-row justify-between gap-6 lg:gap-8 w-full py-4 px-2">
      <div className="flex flex-row items-center gap-2">
        <div className="text-sm font-medium whitespace-nowrap">
          Rows per page
        </div>
        <Select
          value={limit.toString()}
          onValueChange={(value) => setLimit(parseInt(value))}
        >
          <SelectTrigger className="w-20">{limit}</SelectTrigger>
          <SelectContent>
            {limits.map((limit) => (
              <SelectItem key={limit} value={limit.toString()}>
                {limit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row items-center justify-between gap-6">
        <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
          Page {page} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setPage(page + 1)}
            disabled={page === pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setPage(pageCount)}
            disabled={page === pageCount}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
