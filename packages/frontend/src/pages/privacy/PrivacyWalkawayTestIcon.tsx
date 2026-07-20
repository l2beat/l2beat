import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { WalkAwayNotPassedIcon } from '~/icons/WalkAwayNotPassed'
import { WalkAwayPassedIcon } from '~/icons/WalkAwayPassed'
import { cn } from '~/utils/cn'

const PRIVACY_WALKAWAY_TEST_TOOLTIPS = {
  passed:
    'This protocol passes the walkaway test: users can fully use it if all centralized protocol participants disappear.',
  notPassed:
    'This protocol does not pass the walkaway test: users cannot fully use it if all centralized protocol participants disappear.',
} as const

export function PrivacyWalkawayTestIcon({
  passed,
  className,
}: {
  passed: boolean
  className?: string
}) {
  const tooltip = passed
    ? PRIVACY_WALKAWAY_TEST_TOOLTIPS.passed
    : PRIVACY_WALKAWAY_TEST_TOOLTIPS.notPassed

  return (
    <Tooltip>
      <TooltipTrigger aria-label={tooltip} className="shrink-0">
        {passed ? (
          <WalkAwayPassedIcon
            className={cn('size-5 fill-positive', className)}
          />
        ) : (
          <WalkAwayNotPassedIcon
            className={cn('size-5 fill-negative', className)}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
