'use client'
import { UnixTime } from '@l2beat/shared-pure'
import { memo, useState } from 'react'
import { useInterval } from '~/hooks/use-interval'
import { cn } from '~/utils/cn'

interface Props {
  expiresAt: number
  size?: 'lg' | 'md' | 'sm'
  className?: string
  withBackground?: boolean
}

export function Countdown({
  expiresAt,
  size = 'md',
  className,
  withBackground = false,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(
    expiresAt - UnixTime.now().toNumber(),
  )

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
      <MemoizedTimePart suffix="d" size={size}>
        {days}
      </MemoizedTimePart>
      <MemoizedTimePart suffix="h" size={size}>
        {hours}
      </MemoizedTimePart>
      <MemoizedTimePart suffix="m" size={size}>
        {minutes}
      </MemoizedTimePart>
      <MemoizedTimePart suffix="s" size={size}>
        {seconds}
      </MemoizedTimePart>
    </div>
  )
}

export function TextCountdown({ expiresAt }: { expiresAt: number }) {
  const [secondsLeft, setSecondsLeft] = useState(
    expiresAt - UnixTime.now().toNumber(),
  )

  useInterval(() => {
    setSecondsLeft((timeLeft) => timeLeft - 1)
  }, 1000)

  const { days, hours, minutes, seconds } = getTimeParts(secondsLeft)
  return (
    <span>
      {days} days {hours} hours {minutes} minutes {seconds} seconds
    </span>
  )
}

const MemoizedTimePart = memo(TimePart)
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
        className,
      )}
    >
      <span className="tabular-nums">{children}</span>
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

function getTimeParts(timeLeft: number) {
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
