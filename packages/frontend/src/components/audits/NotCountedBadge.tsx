import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { AuditNotCountedReason } from '~/server/features/audits/types'
import { cn } from '~/utils/cn'

const REASON: Record<AuditNotCountedReason, string> = {
  interface:
    'An interface declares no logic, so its status and diff are shown here but left out of the unit counts and the line coverage.',
  vendor:
    'Vendor code that differs from its audited library version, usually a version bump or a small local change of a widely reviewed library. Its status and diff are shown here but left out of the unit counts and the line coverage.',
}

/** Marks a unit that is listed and diffed but left out of every count. */
export function NotCountedBadge({
  reason,
  className,
}: {
  reason: AuditNotCountedReason
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex shrink-0 cursor-default items-center gap-1 rounded-full bg-not-counted/10 px-1.5 py-px font-semibold text-[10px] text-not-counted-ink uppercase leading-[14px] tracking-[0.06em] ring-1 ring-not-counted/40 ring-inset',
            className,
          )}
        >
          <svg
            viewBox="0 0 10 10"
            className="size-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden
          >
            <circle cx="5" cy="5" r="3.8" />
            <path d="M2.3 7.7 7.7 2.3" />
          </svg>
          doesn't count
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[360px]">
        {REASON[reason]}
      </TooltipContent>
    </Tooltip>
  )
}
