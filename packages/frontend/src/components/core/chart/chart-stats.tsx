import { cn } from '~/utils/cn'

export function ChartStats({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-4',
        'mt-5 rounded-lg bg-surface-secondary p-4 md:p-6',
      )}
    >
      {children}
    </div>
  )
}
