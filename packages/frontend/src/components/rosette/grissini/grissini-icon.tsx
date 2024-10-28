'use client'

import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { cn } from '~/utils/cn'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'
import { type RosetteValue } from '../types'
import { SingleGrissini } from './single-grissini'

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
      {values.map((value, i) => (
        <SingleGrissini
          sentiment={value.sentiment}
          key={i}
          onMouseEnter={() => selectRisk(value, 'top')}
        />
      ))}
    </div>
  )
}
