import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function RecentChangesPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: Props) {
  if (totalPages <= 1) return null

  const pages = getPageWindow(page, totalPages)
  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Recent changes pagination"
    >
      <PageButton
        ariaLabel="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronIcon className="size-3 rotate-90 fill-current" />
      </PageButton>
      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`gap-${i}`}
            className="select-none px-1 text-secondary text-xs"
          >
            …
          </span>
        ) : (
          <PageButton
            key={p}
            active={p === page}
            ariaLabel={`Page ${p}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </PageButton>
        ),
      )}
      <PageButton
        ariaLabel="Next page"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronIcon className="-rotate-90 size-3 fill-current" />
      </PageButton>
    </nav>
  )
}

function PageButton({
  children,
  active,
  disabled,
  ariaLabel,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  ariaLabel: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-divider px-2 text-xs transition-colors',
        'hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        active && 'bg-surface-secondary font-bold',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      {children}
    </button>
  )
}

function getPageWindow(page: number, total: number): (number | '…')[] {
  const result: (number | '…')[] = []
  const add = (v: number | '…') => result.push(v)
  if (total <= 7) {
    for (let i = 1; i <= total; i++) add(i)
    return result
  }
  add(1)
  if (page > 3) add('…')
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  for (let i = start; i <= end; i++) add(i)
  if (page < total - 2) add('…')
  add(total)
  return result
}
