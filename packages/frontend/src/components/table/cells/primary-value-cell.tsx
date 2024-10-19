import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
}

export function PrimaryValueCell({ children, className }: Props) {
  return (
    <div className={cn('font-medium md:text-base', className)}>{children}</div>
  )
}
