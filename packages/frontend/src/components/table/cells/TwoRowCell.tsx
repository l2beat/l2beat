import { use } from 'react'
import { cn } from '~/utils/cn'
import { QuietTableContext } from '../QuietTableContext'

interface Props {
  children: React.ReactNode
  className?: string
}

export function TwoRowCell({ children, className }: Props) {
  return <div className={cn('text-left', className)}>{children}</div>
}

TwoRowCell.First = TwoRowCellFirstRow
TwoRowCell.Second = TwoRowCellSecondRow

// In a quiet table, the home rows' 15px for the value and 13px for the line
// under it.
function TwoRowCellFirstRow({ children, className }: Props) {
  const quiet = use(QuietTableContext)
  return (
    <div
      className={cn(
        'font-medium text-xs leading-[15px] md:text-sm md:leading-[1.2]',
        quiet && 'md:text-label-value-15 md:leading-[18px]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function TwoRowCellSecondRow({ children, className }: Props) {
  const quiet = use(QuietTableContext)
  return (
    <div
      className={cn(
        'whitespace-pre-line text-[13px] text-secondary leading-[14px] md:text-xs md:leading-[15px]',
        quiet && 'md:text-label-value-13 md:leading-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
