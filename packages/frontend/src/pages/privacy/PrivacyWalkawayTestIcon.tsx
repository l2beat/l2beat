import { Callout } from '~/components/Callout'
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
  return passed ? (
    <WalkAwayPassedIcon
      className={cn('size-5 shrink-0 fill-positive', className)}
    />
  ) : (
    <WalkAwayNotPassedIcon
      className={cn('size-5 shrink-0 fill-negative', className)}
    />
  )
}

export function PrivacyWalkawayTestTooltipContent({
  passed,
}: {
  passed: boolean
}) {
  return (
    <Callout
      className="mt-2 px-3 py-2"
      color={passed ? 'green' : 'red'}
      icon={<PrivacyWalkawayTestIcon passed={passed} />}
      body={
        passed
          ? PRIVACY_WALKAWAY_TEST_TOOLTIPS.passed
          : PRIVACY_WALKAWAY_TEST_TOOLTIPS.notPassed
      }
    />
  )
}
