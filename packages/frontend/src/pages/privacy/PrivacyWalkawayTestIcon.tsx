import type { PrivacyWalkawayTest } from '@l2beat/config'
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
  walkawayTest,
}: {
  walkawayTest: PrivacyWalkawayTest
}) {
  return (
    <Callout
      className="mt-2 px-3 py-2"
      color={walkawayTest.passed ? 'green' : 'red'}
      icon={<PrivacyWalkawayTestIcon passed={walkawayTest.passed} />}
      body={
        walkawayTest.passed ? (
          PRIVACY_WALKAWAY_TEST_TOOLTIPS.passed
        ) : (
          <div className="flex flex-col gap-1">
            <span>{PRIVACY_WALKAWAY_TEST_TOOLTIPS.notPassed}</span>
            <span>{walkawayTest.reason}</span>
          </div>
        )
      }
    />
  )
}
