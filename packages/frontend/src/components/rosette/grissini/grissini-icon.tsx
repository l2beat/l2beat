'use client'

import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { cn } from '~/utils/cn'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'
import type { RosetteValue } from '../types'
import { SingleGrissini } from './single-grissini'

interface Props {
  values: RosetteValue[]
  className?: string
  hasNoBridge?: boolean
}

const EMPTY: RosetteValue = { name: '', value: '' }
const EMPTY_GRISSINI = [EMPTY, EMPTY, EMPTY]

export function GrissiniIcon({ values, className, hasNoBridge }: Props) {
  const containerRef = useRef(null)
  const context = useRosetteTooltipContext()
  const setSelectedRisk = context?.setSelectedRisk

  useOnClickOutside(containerRef, () => setSelectedRisk?.(undefined))
  useEventListener('scroll', () => setSelectedRisk?.(undefined))

  const selectRisk = (risk: RosetteValue) => {
    setSelectedRisk?.(risk)
  }

  const display = hasNoBridge ? EMPTY_GRISSINI : values

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-row items-center justify-center gap-1',
        className,
      )}
    >
      {display.map((value, i) => (
        <SingleGrissini
          sentiment={
            hasNoBridge ? 'UnderReview' : (value.sentiment ?? 'neutral')
          }
          key={i}
          onMouseEnter={() => selectRisk(value)}
        />
      ))}
      {hasNoBridge && (
        <div className="absolute flex items-center justify-center">
          <ExclamationIcon />
        </div>
      )}
    </div>
  )
}

function ExclamationIcon() {
  return (
    <svg width="7" height="24" viewBox="-0.8 0 8 24">
      <path
        d="M3.26318 24C4.92004 24 6.26318 22.6569 6.26318 21C6.26318 19.3431 4.92004 18 3.26318 18C1.60633 18 0.263184 19.3431 0.263184 21C0.263184 22.6569 1.60633 24 3.26318 24Z"
        fill="#FF0000"
      />
      <path
        d="M5.59664 2.85202e-07H0.929979C0.839965 -8.29722e-05 0.750867 0.0180633 0.668056 0.0533447C0.585246 0.0886261 0.510437 0.140312 0.448142 0.205286C0.385846 0.270261 0.337354 0.347177 0.305588 0.431399C0.273822 0.515621 0.259441 0.605404 0.263312 0.695334L0.929979 16.0287C0.937373 16.2005 1.01086 16.3628 1.13509 16.4816C1.25933 16.6005 1.42469 16.6668 1.59665 16.6667H4.92998C5.10193 16.6668 5.2673 16.6005 5.39153 16.4816C5.51576 16.3628 5.58925 16.2005 5.59664 16.0287L6.26331 0.695334C6.26718 0.605404 6.2528 0.515621 6.22104 0.431399C6.18927 0.347177 6.14078 0.270261 6.07848 0.205286C6.01619 0.140312 5.94138 0.0886261 5.85857 0.0533447C5.77576 0.0180633 5.68666 -8.29722e-05 5.59664 2.85202e-07Z"
        fill="#FF0000"
      />
    </svg>
  )
}
