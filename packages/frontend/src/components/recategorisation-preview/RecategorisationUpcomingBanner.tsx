import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/global/countdowns'

import { UnixTime } from '@l2beat/shared-pure'
import { useEffect, useState } from 'react'
import { useInterval } from '~/hooks/useInterval'
import { cn } from '~/utils/cn'
import { MemoizedTimePart, getTimeParts } from '../Countdown'
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
        'relative z-10 flex w-full flex-col items-center justify-center gap-1 bg-gradient-to-r from-[#7F39B6] to-[#CD1BD3] py-1.5 text-white md:flex-row md:gap-3 dark:text-white',
        className,
      )}
    >
      <span className="font-semibold text-base">
        Recategorisation happening in
      </span>
      <BannerCountdown expiresAt={PROJECT_COUNTDOWNS.otherMigration} />
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
      <div className="flex items-center justify-center gap-1 rounded-lg border border-[#9360BC] bg-[#53227A] px-5 py-1 transition-colors duration-200 hover:bg-[#53227A]/80">
        <span className="font-medium text-xs">Learn more</span>
      </div>
    </CustomLink>
  )
}

function BannerCountdown({ expiresAt }: { expiresAt: number }) {
  const [secondsLeft, setSecondsLeft] = useState<number | undefined>(undefined)

  useEffect(() => {
    setSecondsLeft(expiresAt - UnixTime.now())
  }, [expiresAt])

  useInterval(() => {
    setSecondsLeft((timeLeft) => (timeLeft ? timeLeft - 1 : 0))
  }, 1000)

  if (secondsLeft === undefined) {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[35px] w-[72px] rounded bg-white" />
        ))}
      </div>
    )
  }

  const { days, hours, minutes, seconds } = getTimeParts(secondsLeft)

  const timePartClass = 'h-[35px] w-[72px] bg-white text-black'

  return (
    <div className={cn('flex w-max items-center justify-center gap-x-1')}>
      <MemoizedTimePart suffix={'days'} size="xs" className={timePartClass}>
        {days}
      </MemoizedTimePart>
      <MemoizedTimePart suffix={'hrs'} size="xs" className={timePartClass}>
        {hours}
      </MemoizedTimePart>
      <MemoizedTimePart suffix={'min'} size="xs" className={timePartClass}>
        {minutes}
      </MemoizedTimePart>
      <MemoizedTimePart suffix={'sec'} size="xs" className={timePartClass}>
        {seconds}
      </MemoizedTimePart>
    </div>
  )
}
