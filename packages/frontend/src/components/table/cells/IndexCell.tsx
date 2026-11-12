import { type ReactNode, use } from 'react'
import { cn } from '~/utils/cn'
import { QuietTableContext } from '../QuietTableContext'

interface IndexCellProps {
  children: ReactNode
  className?: string
}

export function IndexCell({ children, className }: IndexCellProps) {
  const quiet = use(QuietTableContext)
  return (
    <div
      className={cn(
        'ml-auto text-right font-medium text-xs text-zinc-500 tabular-nums dark:font-normal dark:text-n-zinc-300',
        // As the home rankings' rank: small print.
        quiet &&
          'font-normal text-label-value-13 text-secondary dark:text-secondary',
        className,
      )}
    >
      {children}
    </div>
  )
}
