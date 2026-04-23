import type { ReactNode } from 'react'
import { Badge } from '~/components/core/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/Tooltip'
import { cn } from '~/utils/cn'
import type { MissingTokenStatus } from './types'
import { getMissingTokenStatusMeta } from './utils'

interface MissingTokenStatusBadgeProps {
  status: MissingTokenStatus
  children?: ReactNode
  className?: string
  showTooltip?: boolean
}

export function MissingTokenStatusBadge({
  status,
  children,
  className,
  showTooltip = true,
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

  if (!showTooltip) {
    return badge
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">{badge}</span>
      </TooltipTrigger>
      <TooltipContent>{meta.description}</TooltipContent>
    </Tooltip>
  )
}
