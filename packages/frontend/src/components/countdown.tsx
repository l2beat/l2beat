'use client'
import { memo, useState } from 'react'
import { useEffect } from 'react'
import { cn } from '~/utils/cn'

export function Countdown({
  expiresAt,
  size,
}: { expiresAt: number; size?: 'md' | 'sm' }) {
  const [timeLeft, setTimeLeft] = useState(expiresAt - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1000)
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const { months, days, hours, minutes, seconds } = getTimeParts(timeLeft)

  return (
    <div className="flex w-max gap-x-1 rounded-lg border border-divider bg-surface-secondary p-2">
      {months > 0 && (
        <MemoizedTimePart suffix="mo" size={size}>
          {months}
        </MemoizedTimePart>
      )}
      <MemoizedTimePart suffix="d" size={size}>
        {days}
      </MemoizedTimePart>
      <MemoizedTimePart suffix="hr" size={size}>
        {hours}
      </MemoizedTimePart>
      <MemoizedTimePart suffix="m" size={size}>
        {minutes}
      </MemoizedTimePart>
      <MemoizedTimePart
        suffix="s"
        size={size}
        className={cn(size === 'md' && 'w-[67px]', size === 'sm' && 'w-[54px]')}
      >
        {seconds}
      </MemoizedTimePart>
    </div>
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
  size?: 'md' | 'sm'
}) {
  return (
    <div
      className={cn(
        'rounded bg-brand px-3 py-2 text-center text-[28px] font-bold text-primary-invert',
        size === 'md' && 'text-[28px]',
        size === 'sm' && 'text-[18px]',
        className,
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          'ml-0.5 leading-none',
          size === 'md' && 'text-lg',
          size === 'sm' && 'text-xs',
        )}
      >
        {suffix}
      </span>
    </div>
  )
}

function getTimeParts(timeLeft: number) {
  const months = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 30))
  const days = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24),
  )
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  return { months, days, hours, minutes, seconds }
}
