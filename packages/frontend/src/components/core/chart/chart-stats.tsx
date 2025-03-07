import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { SyncStatusWrapper } from '~/app/(side-nav)/scaling/finality/_components/table/sync-status-wrapper'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { cn } from '~/utils/cn'
import { Skeleton } from '../skeleton'

const chartStatsVariants = cva(
  'grid rounded-lg bg-surface-secondary p-4 md:gap-4 md:p-6',
  {
    variants: {
      columns: {
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
      },
    },
  },
)

interface Props {
  columns: NonNullable<VariantProps<typeof chartStatsVariants>['columns']>
  children: React.ReactNode
}

export function ChartStats({ children, columns }: Props) {
  return <div className={chartStatsVariants({ columns })}>{children}</div>
}

export function ChartStatsItem({
  label,
  value,
  isSynced = true,
  isLoading,
  className,
}: {
  label: string
  value: string | undefined
  isSynced?: boolean
  isLoading?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 md:flex-col md:items-start',
        className,
      )}
    >
      <span className="whitespace-nowrap text-xs font-medium text-secondary">
        {label}
      </span>
      {value ? (
        <SyncStatusWrapper isSynced={isSynced}>
          <span className="text-sm font-medium text-primary xs:text-lg md:font-bold">
            {value}
          </span>
        </SyncStatusWrapper>
      ) : isLoading ? (
        <Skeleton className="h-[22px] w-20 xs:h-7 xs:w-24" />
      ) : (
        <NoDataBadge />
      )}
    </div>
  )
}
