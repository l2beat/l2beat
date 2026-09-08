import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { cn } from '~/utils/cn'
import { AUDIT_STATUS_META, AUDIT_STATUS_ORDER } from './auditStatus'

export function AuditStatusLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-x-4 gap-y-1 text-secondary text-xs',
        className,
      )}
    >
      {AUDIT_STATUS_ORDER.map((status) => (
        <Tooltip key={status}>
          <TooltipTrigger className="flex items-center gap-1.5">
            <span
              className={cn(
                'size-2.5 rounded-sm',
                AUDIT_STATUS_META[status].bg,
              )}
            />
            {AUDIT_STATUS_META[status].label}
          </TooltipTrigger>
          <TooltipContent>
            {AUDIT_STATUS_META[status].description}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
