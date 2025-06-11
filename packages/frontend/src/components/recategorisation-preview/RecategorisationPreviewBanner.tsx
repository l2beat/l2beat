import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/global/countdowns'
import { cn } from '~/utils/cn'
import { TextCountdown } from '../Countdown'
import { useRecategorisationPreviewContext } from './RecategorisationPreviewProvider'

export function RecategorisationPreviewBanner({
  className,
}: { className?: string }) {
  const { checked, isScalingMainPage } = useRecategorisationPreviewContext()
  if (!checked || !isScalingMainPage) {
    return null
  }

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center gap-1 bg-brand px-4 py-1.5 text-primary-invert md:flex-row md:gap-3',
        className,
      )}
    >
      <div className="text-balance text-center text-sm">
        You&apos;re viewing a preview of the recategorisation that will come
        into force in{' '}
        <TextCountdown expiresAt={PROJECT_COUNTDOWNS.otherMigration} />.
      </div>
    </div>
  )
}
