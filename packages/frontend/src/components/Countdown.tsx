import { UnixTime } from '@l2beat/shared-pure'
import { memo, useState } from 'react'
import { useInterval } from '~/hooks/useInterval'
import { cn } from '~/utils/cn'

interface Props {
  expiresAt: number
  size?: 'lg' | 'md' | 'sm' | 'xs'
  className?: string
  withBackground?: boolean
  shortSuffix?: boolean
  timePartClassName?: string
}

export function Countdown({
  expiresAt,
  size = 'md',
  className,
  withBackground = false,
  shortSuffix = true,
  timePartClassName,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(expiresAt - UnixTime.now())

  useInterval(() => {
    setSecondsLeft((timeLeft) => timeLeft - 1)
  }, 1000)

  const { days, hours, minutes, seconds } = getTimeParts(secondsLeft)

  return (
    <div
      className={cn(
        'flex w-max items-center justify-center gap-x-1',
        withBackground &&
          'rounded-lg border border-divider bg-surface-secondary p-2',
        className,
      )}
    >
      <MemoizedTimePart
        suffix={shortSuffix ? 'd' : 'days'}
        size={size}
        className={timePartClassName}
      >
        {days}
      </MemoizedTimePart>
      <MemoizedTimePart
        suffix={shortSuffix ? 'h' : 'hrs'}
        size={size}
        className={timePartClassName}
      >
        {hours}
      </MemoizedTimePart>
      <MemoizedTimePart
        suffix={shortSuffix ? 'm' : 'min'}
        size={size}
        className={timePartClassName}
      >
        {minutes}
      </MemoizedTimePart>
      <MemoizedTimePart
        suffix={shortSuffix ? 's' : 'sec'}
        size={size}
        className={timePartClassName}
      >
        {seconds}
      </MemoizedTimePart>
    </div>
  )
}

export function TextCountdown({ expiresAt }: { expiresAt: number }) {
  const [secondsLeft, setSecondsLeft] = useState(expiresAt - UnixTime.now())

  useInterval(() => {
    setSecondsLeft((timeLeft) => timeLeft - 1)
  }, 1000)

  const { days, hours, minutes, seconds } = getTimeParts(secondsLeft)
  return (
    <span suppressHydrationWarning>
      {days} days {hours} hours {minutes} minutes {seconds} seconds
    </span>
  )
}

export const MemoizedTimePart = memo(TimePart)
function TimePart({
  children,
  suffix,
  className,
  size = 'md',
}: {
  children: React.ReactNode
  suffix: string
  className?: string
  size?: Props['size']
}) {
  return (
    <div
      className={cn(
        'rounded bg-brand px-3 py-2 text-center font-bold text-primary-invert',
        size === 'lg' && 'text-[28px]',
        size === 'md' && 'text-2xl leading-none',
        size === 'sm' && 'text-[18px]',
        size === 'xs' && 'px-1.5 py-[3.5px] text-[18px]',
        className,
      )}
    >
      <span className="tabular-nums" suppressHydrationWarning>
        {children}
      </span>
      <span
        className={cn(
          'ml-0.5',
          size === 'lg' && 'text-lg leading-none',
          size === 'md' && 'text-base leading-none',
          size === 'sm' && 'text-xs leading-none',
        )}
      >
        {suffix}
      </span>
    </div>
  )
}

export function getTimeParts(timeLeft: number) {
  const days = Math.floor(timeLeft / (60 * 60 * 24))
  const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60)
  const seconds = Math.floor(timeLeft % 60)

  const format = (value: number) =>
    Math.max(0, value).toString().padStart(2, '0')

  return {
    days: format(days),
    hours: format(hours),
    minutes: format(minutes),
    seconds: format(seconds),
  }
}
