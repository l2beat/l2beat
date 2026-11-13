import * as React from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { Button } from './core/Button'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center gap-0.5', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'default',
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant={isActive ? 'fill' : 'outline'}
      size={size}
      className={cn(
        'flex h-7 min-w-7 items-center justify-center rounded-md px-2',
        'font-medium text-label-value-12 transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-40',
        // The section's controls add no colour: the brand stays for data.
        isActive
          ? 'border-primary bg-primary text-primary-invert'
          : 'border-divider text-primary hover:bg-surface-secondary',
        className,
      )}
    >
      <a
        aria-current={isActive ? 'page' : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        {...props}
      />
    </Button>
  )
}

function PaginationPrevious({
  className,
  text = 'Previous',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 pl-1.5!', className)}
      {...props}
    >
      <ChevronIcon className="size-3 rotate-90 fill-current" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = 'Next',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 pr-1.5!', className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronIcon className="-rotate-90 size-3 fill-current" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        'flex size-8 items-center justify-center font-bold text-label-value-16',
        className,
      )}
      {...props}
    >
      ...
      <span className="sr-only">More pages</span>
    </span>
  )
}

type PaginationItem =
  | { type: 'page'; index: number }
  | { type: 'ellipsis'; key: string }

function getPaginationItems(pageCount: number, currentPage: number) {
  const edgeCount = 2
  const siblingCount = 1

  const pages = new Set<number>()

  for (let i = 0; i < Math.min(edgeCount, pageCount); i++) {
    pages.add(i)
  }

  for (let i = Math.max(pageCount - edgeCount, 0); i < pageCount; i++) {
    pages.add(i)
  }

  for (
    let i = Math.max(currentPage - siblingCount, 0);
    i <= Math.min(currentPage + siblingCount, pageCount - 1);
    i++
  ) {
    pages.add(i)
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b)
  const items: PaginationItem[] = []

  for (const page of sortedPages) {
    const previous = items[items.length - 1]
    if (previous?.type === 'page' && page - previous.index > 1) {
      items.push({
        type: 'ellipsis',
        key: `${previous.index}-${page}`,
      })
    }

    items.push({ type: 'page', index: page })
  }

  return items
}

export {
  getPaginationItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
