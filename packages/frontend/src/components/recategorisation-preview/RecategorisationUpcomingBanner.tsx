import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/global/countdowns'

import { UnixTime } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'
import { Countdown } from '../Countdown'
import { CustomLink } from '../link/CustomLink'

export function RecategorisationUpcomingBanner({
  className,
}: { className?: string }) {
  const enabled = UnixTime.now() < PROJECT_COUNTDOWNS.otherMigration
  if (!enabled) {
    return null
  }

  return (
    <div
      className={cn(
        'glass-panel glass-content !rounded-t-none relative z-10 flex w-full flex-col items-center justify-center gap-1 py-1.5 text-white md:flex-row md:gap-3 dark:text-white',
        className,
      )}
    >
      <span className="text-sm">Recategorisation happening in</span>
      <Countdown
        expiresAt={PROJECT_COUNTDOWNS.otherMigration}
        shortSuffix={false}
        size="xs"
        timePartClassName="bg-white text-black"
      />
      <BannerActionButton />
    </div>
  )
}

function BannerActionButton() {
  return (
    <CustomLink
      href="https://medium.com/l2beat/framework-update-l2-projects-recategorization-5d43b0d1fe50"
      variant="plain"
      underline={false}
      className="text-white dark:text-white"
    >
      <div className="!rounded-lg glass-panel glass-content flex items-center justify-center gap-1 border px-5 py-1 transition-colors duration-200 ">
        <span className="font-medium text-xs">Learn more</span>
      </div>
    </CustomLink>
  )
}
