import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
}

export function TwoRowCell({ children, className }: Props) {
  return <div className={cn('text-left', className)}>{children}</div>
}

TwoRowCell.First = TwoRowCellFirstRow
TwoRowCell.Second = TwoRowCellSecondRow

function TwoRowCellFirstRow({ children, className }: Props) {
  return (
    <div
      className={cn(
        'font-medium text-xs leading-[15px] md:text-sm md:leading-[1.2]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function TwoRowCellSecondRow({ children, className }: Props) {
  return (
    <div
      className={cn(
        'text-[13px] text-secondary leading-[14px] md:text-xs md:leading-[15px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
