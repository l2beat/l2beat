import type { MouseEvent } from 'react'
import {
  getPaginationItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/Pagination'
import { cn } from '~/utils/cn'

/**
 * Links to the list's anchor, so turning a page also scrolls back to its top
 * instead of leaving the visitor at the bottom of a shorter page.
 */
export function HoldingsPagination({
  page,
  pageCount,
  anchorId,
  onPageChange,
}: {
  page: number
  pageCount: number
  anchorId: string
  onPageChange: (page: number) => void
}) {
  const href = `#${anchorId}`
  const goToPage = (nextPage: number) => (event: MouseEvent) => {
    event.preventDefault()
    onPageChange(Math.min(Math.max(nextPage, 0), pageCount - 1))
    document.getElementById(anchorId)?.scrollIntoView({ block: 'start' })
  }
  const isFirst = page === 0
  const isLast = page === pageCount - 1

  return (
    <Pagination className="pt-1">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={href}
            onClick={goToPage(page - 1)}
            aria-disabled={isFirst}
            className={cn(isFirst && 'pointer-events-none opacity-40')}
          />
        </PaginationItem>
        {getPaginationItems(pageCount, page).map((item) =>
          item.type === 'ellipsis' ? (
            <PaginationItem key={item.key}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item.index}>
              <PaginationLink
                href={href}
                isActive={item.index === page}
                onClick={goToPage(item.index)}
              >
                {item.index + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={href}
            onClick={goToPage(page + 1)}
            aria-disabled={isLast}
            className={cn(isLast && 'pointer-events-none opacity-40')}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
