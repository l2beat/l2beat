import { SyncStatusWrapper } from '~/app/(side-nav)/scaling/finality/_components/table/sync-status-wrapper'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { InfoIcon } from '~/icons/info'
import { cn } from '~/utils/cn'
import { Skeleton } from '../skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/tooltip'

interface Props {
  children: React.ReactNode
}

export function ChartStats({ children }: Props) {
  return (
    <div className="grid rounded-lg bg-surface-secondary p-4 md:grid-cols-2 md:gap-4 md:p-6 lg:grid-cols-4">
      {children}
    </div>
  )
}

export function ChartStatsItem({
  label,
  children,
  tooltip,
  isSynced = true,
  isLoading,
  className,
}: {
  label: React.ReactNode
  children: React.ReactNode
  tooltip?: string
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
      <div className="flex items-center gap-1.5">
        <span className="whitespace-nowrap text-xs font-medium text-secondary">
          {label}
        </span>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {children ? (
        <SyncStatusWrapper isSynced={isSynced}>
          <span className="text-sm font-medium text-primary xs:text-lg md:font-bold">
            {children}
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
