import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
import { Skeleton } from '../Skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

interface Props {
  children: React.ReactNode
  className?: string
}

export function ChartStats({ children, className }: Props) {
  return (
    <div
      className={cn(
        'grid rounded-lg bg-surface-secondary p-4 md:grid-cols-2 md:gap-4 md:p-6 lg:grid-cols-4',
        className,
      )}
    >
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
        'flex flex-col items-start justify-between gap-2 max-md:flex-row max-md:items-center',
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="whitespace-nowrap font-medium text-secondary text-xs">
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
      {isLoading ? (
        <Skeleton className="h-[22px] xs:h-7 w-20 xs:w-24" />
      ) : children ? (
        <SyncStatusWrapper isSynced={isSynced}>
          <span className="font-medium text-primary text-sm xs:text-lg md:font-bold">
            {children}
          </span>
        </SyncStatusWrapper>
      ) : (
        <NoDataBadge />
      )}
    </div>
  )
}
