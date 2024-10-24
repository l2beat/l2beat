import { type Sentiment } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { cn } from '~/utils/cn'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'
import { type RosetteValue } from '../types'

interface Props {
  values: RosetteValue[]
  className?: string
}

export function GrissiniIcon({ values, className }: Props) {
  const containerRef = useRef(null)
  const context = useRosetteTooltipContext()

  useOnClickOutside(containerRef, () => setContent?.(undefined))
  useEventListener('scroll', () => setContent?.(undefined))

  const setContent = context?.setContent

  const selectRisk = (risk: RosetteValue, side: 'top' | 'bottom') => {
    setContent?.({
      risk,
      side: side,
      sideOffset: side === 'top' ? -60 : -55,
    })
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-row items-center justify-center gap-1',
        className,
      )}
    >
      {values.map((value, i) => {
        const bgColor = sentimentToBgColor(value.sentiment)

        return (
          <div
            className={cn('h-8 w-2 rounded-full', bgColor)}
            key={i}
            onMouseEnter={() => selectRisk(value, 'top')}
          />
        )
      })}
    </div>
  )
}

function sentimentToBgColor(sentiment: Sentiment) {
  switch (sentiment) {
    case 'bad':
      return 'bg-orange-600'
    case 'warning':
      return 'bg-yellow-200'
    case 'good':
      return 'bg-[#15CA60] dark:bg-green-450'
    case 'neutral':
    case 'UnderReview':
      return 'bg-gray-400 dark:bg-zinc-700'
  }
}
