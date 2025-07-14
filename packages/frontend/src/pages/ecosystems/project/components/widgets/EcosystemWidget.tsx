import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'

export function EcosystemWidget({
  children,
  asChild,
  className,
}: {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}) {
  return (
    <PrimaryCard asChild={asChild} className={cn('rounded-lg!', className)}>
      {children}
    </PrimaryCard>
  )
}

export function EcosystemWidgetTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h2 className={cn('mb-6 font-bold text-xl', className)}>{children}</h2>
}
