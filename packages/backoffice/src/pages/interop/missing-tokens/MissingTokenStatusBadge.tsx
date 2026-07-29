import { CircleAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '~/components/core/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/Tooltip'
import { cn } from '~/utils/cn'
import type { MissingTokenIngestionStatus, MissingTokenStatus } from './types'
import { getMissingTokenStatusMeta } from './utils'

interface MissingTokenStatusBadgeProps {
  status: MissingTokenStatus
  children?: ReactNode
  className?: string
  showTooltip?: boolean
  ingestionStatus?: MissingTokenIngestionStatus
}

export function MissingTokenStatusBadge({
  status,
  children,
  className,
  showTooltip = true,
  ingestionStatus,
}: MissingTokenStatusBadgeProps) {
  const meta = getMissingTokenStatusMeta(status)

  const badge = (
    <Badge
      variant={meta.badgeVariant}
      className={cn(meta.badgeClassName, className)}
    >
      {children ?? meta.label}
    </Badge>
  )

  const ingestionIndicator =
    ingestionStatus === 'no-coingecko' ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <CircleAlertIcon
            aria-label="Not listed on CoinGecko"
            className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
          />
        </TooltipTrigger>
        <TooltipContent>
          Automatic ingestion found no CoinGecko listing for this address.
        </TooltipContent>
      </Tooltip>
    ) : null

  const content = (
    <span className="inline-flex items-center gap-1">
      {badge}
      {ingestionIndicator}
    </span>
  )

  if (!showTooltip) return content

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>{meta.description}</TooltipContent>
    </Tooltip>
  )
}
