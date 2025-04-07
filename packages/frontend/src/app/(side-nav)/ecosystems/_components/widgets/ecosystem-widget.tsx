import { PrimaryCard } from '~/components/primary-card/primary-card'

export function EcosystemWidget({
  children,
  asChild,
  className,
}: { children: React.ReactNode; asChild?: boolean; className?: string }) {
  return (
    <PrimaryCard asChild={asChild} className={className}>
      {children}
    </PrimaryCard>
  )
}

export function EcosystemWidgetTitle({
  children,
}: { children: React.ReactNode }) {
  return <h2 className="mb-6 text-xl font-bold">{children}</h2>
}
