import { cn } from '~/utils/cn'
import { HorizontalSeparator } from './core/horizontal-separator'

interface PageHeaderProps {
  children: string
  className?: string
}

export function SimplePageHeader({ children, className }: PageHeaderProps) {
  return (
    <header className={cn('mt-4 md:mt-12', className)}>
      <h1 className="mb-1 text-3xl font-bold">{children}</h1>
      <HorizontalSeparator className="mt-2 md:hidden" />
    </header>
  )
}
