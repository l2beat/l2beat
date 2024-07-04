import { type ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { useChartContext } from './chart-context'

export const FIRST_LABEL_HEIGHT_PX = 20

export function ChartLabels({
  className,
}: {
  className?: string
}) {
  const context = useChartContext()
  return (
    <div
      className={cn(
        'pointer-events-none relative z-25 flex h-full justify-between flex-col-reverse pt-5',
        className,
      )}
    >
      {context.labels.map((label, i) => (
        <ChartLabel key={i}>{label}</ChartLabel>
      ))}
    </div>
  )
}

function ChartLabel({ children }: { children?: ReactNode }) {
  const { loading } = useChartContext()
  return (
    <div className="relative">
      {!loading ? (
        <span className="absolute bottom-0 left-0 pb-0.5 text-gray-500 text-sm text-opacity-50 dark:text-white dark:text-opacity-50">
          {children}
        </span>
      ) : null}
      <hr className="border-gray-850/30 dark:border-white/30" />
    </div>
  )
}
